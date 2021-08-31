<template>
    <div>
        <page-main>
            <el-divider content-position="left">单图上传</el-divider>
            <image-upload :url.sync="image" action="http://cdn.digitalcnzz.com/api/upload/upload" name="image" :width="250" :height="150" :data="{'token':'TKD628431923530324'}" @onSuccess="handleSuccess1" />
            <el-divider content-position="left">多图上传（默认最多3张）</el-divider>
            <images-upload :url="images" action="http://cdn.digitalcnzz.com/api/upload/upload" name="image" :data="{'token':'TKD628431923530324'}" @onSuccess="handleSuccess2" />
            <el-divider content-position="left">文件上传（默认最多3个）</el-divider>
            <file-upload :files="files" action="http://cdn.digitalcnzz.com/api/upload/upload" name="image" :data="{'token':'TKD628431923530324'}" @onSuccess="handleSuccess3" />
        </page-main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            image: '',
            images: [
                'https://cdn.digitalcnzz.com/2021/06/01/aadd6d581bf5452a99038267224ac533cloud.jpeg'
            ],
            files: [
                {
                    name: '测试文件.zip',
                    url: 'https://cdn.digitalcnzz.com/test/%E6%B5%8B%E8%AF%95%E6%96%87%E4%BB%B6.zip'
                }
            ]
        }
    },
    methods: {
        handleSuccess1(res) {
            if (res.error == '') {
                this.image = res.data.path
            } else {
                this.$message.warning(res.error)
            }
        },
        handleSuccess2(res) {
            if (res.error == '') {
                this.images.push(res.data.path)
            } else {
                this.$message.warning(res.error)
            }
        },
        handleSuccess3(res, file) {
            this.files.push({
                name: file.name,
                url: res.error == '' ? res.data.path : ''
            })
            this.$nextTick(() => {
                if (res.error != '') {
                    this.$message.warning(res.error)
                    this.files.pop()
                }
            })
        }
    }
}
</script>
