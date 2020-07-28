<template>
    <div v-if="item.meta.sidebar !== false">
        <!-- eslint-disable-next-line vue/require-component-is -->
        <component v-if="!hasChildren" v-bind="linkProps(resolvePath(item.path))">
            <el-menu-item :title="item.meta.title" :index="resolvePath(item.path)">
                <svg-icon v-if="item.meta.icon" :name="item.meta.icon" />
                <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
        </component>
        <el-submenu v-else :title="item.meta.title" :index="resolvePath(item.path)">
            <template slot="title">
                <svg-icon v-if="item.meta.icon" :name="item.meta.icon" />
                <span>{{ item.meta.title }}</span>
            </template>
            <SidebarItem v-for="route in item.children" :key="route.path" :item="route" :base-path="resolvePath(item.path)" />
        </el-submenu>
    </div>
</template>

<script>
import path from 'path'

export default {
    name: 'SidebarItem',
    props: {
        item: {
            type: Object,
            required: true
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    data() {
        return {}
    },
    computed: {
        hasChildren() {
            let flag = true
            if (this.item.children) {
                if (this.item.children.every(item => item.meta.sidebar === false)) {
                    flag = false
                }
            } else {
                flag = false
            }
            return flag
        }
    },
    created() {},
    mounted() {},
    methods: {
        isExternal(path) {
            return /^(https?:|mailto:|tel:)/.test(path)
        },
        linkProps(url) {
            if (this.isExternal(url)) {
                return {
                    is: 'a',
                    href: url,
                    target: '_blank',
                    rel: 'noopener'
                }
            }
            return {
                is: 'router-link',
                to: url
            }
        },
        resolvePath(routePath) {
            if (this.isExternal(routePath)) {
                return routePath
            }
            if (this.isExternal(this.basePath)) {
                return this.basePath
            }
            return path.resolve(this.basePath, routePath)
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-menu-item,
/deep/ .el-menu-item span,
/deep/ .el-submenu__title,
/deep/ .el-submenu__title span {
    vertical-align: inherit;
    @include text-overflow;
}
/deep/ .el-submenu,
/deep/ .el-menu-item {
    .el-menu {
        .el-submenu .el-submenu__title,
        .el-menu-item {
            background-color: $g_sidebar_bg - 20 !important;
            &:hover {
                background-color: $g_sidebar_bg - 40 !important;
            }
            &.is-active {
                background-color: $g-sidebar-menu-active-bg !important;
            }
        }
    }
    &.is-active {
        background-color: $g-sidebar-menu-active-bg !important;
    }
    .svg-icon {
        font-size: 20px;
        margin-right: 10px;
        vertical-align: -0.25em;
    }
}
a {
    cursor: pointer;
    color: inherit;
    text-decoration: none;
}
</style>
