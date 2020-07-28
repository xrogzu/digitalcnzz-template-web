export default {
    data() {
        return {
            loading: false,
            sort: null,
            order: null,
            pagination: {
                page: 1,
                size: 10,
                total: 0,
                sizes: [10, 20, 50, 100],
                layout: 'total, sizes, ->, prev, pager, next, jumper'
            }
        }
    },
    methods: {
        onSizeChange(size) {
            this.pagination.size = size
            this.getDataList()
        },
        onCurrentChange(page) {
            this.pagination.page = page
            this.getDataList()
        },
        onSortChange(params) {
            if (params.order) {
                this.sort = params.prop
                this.order = params.order === 'ascending' ? 'asc' : 'desc'
            } else {
                this.sort = null
                this.order = null
            }
            this.getDataList()
        }
    }
}
