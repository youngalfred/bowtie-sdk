<script setup lang='ts'>
    import type { PropType } from 'vue'
    import type { Fieldgroup, InputNode, Node } from '../../../types'
    import form from '@/assets/windmit/form.png'
    import Renderer from '../../Renderer.vue'
    import modifyWindMitField from './wm-modifiers';

    const flattenModifiedChildren = (fieldgroup: Fieldgroup): InputNode[] => {
      const assembleFieldset = (acc: InputNode[], field: Node): InputNode[] => {
        const { children = [] } = field as Fieldgroup
        if (children.length) {
            return children.reduce(assembleFieldset, acc)
        }

        return acc.concat(modifyWindMitField(field as InputNode))
      }

      return fieldgroup.children.reduce(assembleFieldset, [])
    }

    const props = defineProps({
      field: {
          type: Object as PropType<Fieldgroup>,
          required: true
      }
    })

    console.log({ field: props.field })
</script>

<template>
    <div class='windmit'>
        <img class='windmitForm' :src='form' alt="Florida Wind Mitigation Inspection Form" />
        <div class='windmitPage'>
            <Renderer v-for="child of flattenModifiedChildren(field)" :key="child.id" :field="child" />
        </div>
    </div>
</template>

<style lang="scss">

  .windmit {
    position: relative;
    width: 815px;
  }

  .windmitForm {
      top: 0;
      left: 0;
      width: auto;
      max-width: 100%;
      margin: 0;
      padding: 0;
      border: 1px solid rgb(181 191 199 / 100%);
  }

  .windmitPage {
      top: 0;
      left: 0;
      position: absolute;
      width: 815px;
      height: 100%;
  }

</style>