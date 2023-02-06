<script setup lang="ts">
import submitFiles from '@/api/file'
import {
  validFileTypesRecord,
  filesReducer,
  type FileUploader,
  type UploadResult,
  validFileTypes,
} from '@/utils/file-upload'
import { reactive, type PropType } from 'vue'
import { computed } from 'vue'
import type { Field } from '../../../types'

const props = defineProps({
  field: {
    type: Object as PropType<Field>,
    required: true,
  },
})

const uploadedFiles = computed(() => JSON.parse(props.field.value || '{}'))

const data = reactive<FileUploader>({
  invalidFiles: [],
  failedFiles: [],
  selectedFiles: [],
  isUploadDisabled: false,
  parsedValue: {},

  onChange: (e: Event) => {
    const { files = [] } = e.target as HTMLInputElement
    const { selected, invalid } = Array.from(files || []).reduce(filesReducer, {
      selected: [],
      invalid: [],
    })

    data.isUploadDisabled = false
    data.invalidFiles = invalid
    data.selectedFiles = selected

    if (data.invalidFiles.length) {
      window.alert(
        `We support only the following file formats: \n${Object.keys(validFileTypesRecord).join(
          ', ',
        )}.\n\nThe following files are not one of the above file formats: ${data.invalidFiles
          .map(f => `\n- ${f.name}`)
          .join(' ')}`,
      )
    }
  },
  removeSelectedFileAt: (index: number) => () => {
    data.selectedFiles = [
      ...data.selectedFiles.slice(0, index),
      ...data.selectedFiles.slice(index + 1),
    ]
  },
  uploadFiles: async (): Promise<void> => {
    if (data.isUploadDisabled) return

    data.isUploadDisabled = true

    const results = await submitFiles(data.selectedFiles)

    data.selectedFiles = []
    // Indicate to user which files failed the upload
    data.failedFiles = data.selectedFiles.reduce((acc, { name }) => {
      if (!results.some(({ fileName }) => fileName === name)) {
        return [
          ...acc,
          {
            name,
            success: false,
          },
        ]
      }
      return acc
    }, [] as UploadResult[])

    const makeDuplicateFileName = (fileName: string, duplicateCount: number) =>
      `${fileName}${duplicateCount > 0 ? ` (copy ${duplicateCount})` : ''}`
    const updatedValue = results.reduce((acc, { objectId, fileName }) => {
      let duplicateCounter = 0
      while (acc[makeDuplicateFileName(fileName, duplicateCounter)]) {
        duplicateCounter += 1
      }

      acc[makeDuplicateFileName(fileName, duplicateCounter)] = objectId
      return acc
    }, uploadedFiles.value)

    props.field.onChange(JSON.stringify(updatedValue))
  },
  makeNewFileInput: () => {
    let inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.onchange = data.onChange
    inputElement.multiple = true
    inputElement.accept = validFileTypes.join(', ')
    inputElement.click()
  },
})
</script>

<template>
  <div class="button-wrapper">
    <button @click="data.makeNewFileInput">Select Files</button>

    <div v-if="data.selectedFiles.length">
      <Button @click="data.uploadFiles" :disabled="data.isUploadDisabled"> Upload </Button>
    </div>
  </div>

  <div class="files-container">
    <div>
      <h5>Selected files:</h5>
      <div v-for="file of data.selectedFiles">
        {{ file.name }}
      </div>

      <h5 v-if="data.failedFiles.length">
        The following files failed to upload (please try again):
      </h5>
      <div v-for="file of data.failedFiles">
        {{ file.name }}
      </div>
    </div>
    <div>
      <h5>Successfully uploaded files:</h5>
      <div v-for="name of Object.keys(uploadedFiles)">
        {{ name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-wrapper {
  display: flex;
}

.files-container {
  display: flex;
  justify-content: space-around;
}
</style>
