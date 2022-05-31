<script setup lang="ts">
    import type { PropType } from 'vue';
    import { RouterLink } from 'vue-router'

    type Action = {
        path: string
        label: string
        disabled: boolean
    }

    const {buttons} = defineProps({
        buttons: {
            type: Object as PropType<Action[]>,
            required: true
        }
    })

    const buttonCount = (() => {
        switch (buttons.length) {
            case 1:
                return 'one'
            case 2:
                return 'two'
            case 3:
                return 'three'
            default:
                return 'default'
        }
    })()
</script>

<template>
    <section :class="buttonCount">
        <RouterLink v-for="btn in buttons" :key="btn.path" :class="`${btn.disabled ? 'disabled' : ''}`" :to="btn.path">{{btn.label}}</RouterLink>
    </section>
</template>

<style scoped>

    section {
        position: fixed;
        width: 100%;
        bottom: 0;
        height: 100px;
        background-color: hsla(160, 100%, 37%, 1);
        padding: 1em;
        margin: 0 auto;
        text-align: center;
    }
    
    a {
        padding: 1em;
        align-self: center;
        border-radius: 5px;
        border: 1px solid white;
        background-color: white;
        color: hsla(160, 100%, 37%, 1);
        font-weight: 700;
    }

    a.disabled {
        pointer-events: none;
        background-color: #efefef;
        color: #ababab;
    }

    a:hover, a:active {
        color: white;
        background-color: rgb(112, 226, 188);
    }

    .one {
        display: flex;
        justify-content: center;
    }

    .two {
        display: flex;
        justify-content: space-evenly;
    }

    .three {
        display: grid;
        grid-template-columns: repeat(3, minmax(70px, 1fr));
    }
</style>