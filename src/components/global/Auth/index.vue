<template>
    <div>
        <slot v-if="check()" />
        <slot v-else name="no-auth" />
    </div>
</template>

<script>
import { auth } from '@/util/index'

export default {
    name: 'Auth',
    props: {
        value: {
            type: [String, Array],
            default: ''
        }
    },
    methods: {
        check() {
            return auth(this.value)
        }
    }
}
</script>
