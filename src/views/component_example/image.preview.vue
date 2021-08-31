<template>
    <div>
        <page-main>
            <image-preview src="https://cdn.digitalcnzz.com/2021/06/01/aadd6d581bf5452a99038267224ac533cloud.jpeg" :width="200" />
            <image-preview src="https://cdn.digitalcnzz.com/2021/06/01/aadd6d581bf5452a99038267224ac533cloud.jpeg" :width="200" :height="150" />
            <el-divider content-position="left">加载失败</el-divider>
            <image-preview src="" width="100px" height="100px" />
        </page-main>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {}
    },
    created() {},
    mounted() {},
    methods: {}
}
</script>

<style lang="scss" scoped>
// scss
</style>
