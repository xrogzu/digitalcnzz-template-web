<template>
    <div class="layout">
        <div id="app-main">
            <header v-if="$store.state.global.showHeader">
                <div class="header-container">
                    <div class="main">
                        <Logo />
                        <div class="nav">
                            <template v-for="(item, index) in $store.state.global.allRoutes">
                                <div v-if="item.children && item.children.length !== 0" :key="index" :class="'item ' + (index == $store.state.global.headerNavActive ? 'active' : '')" @click="$store.commit('global/switchHeader', index)">
                                    <svg-icon v-if="item.meta.icon" :name="item.meta.icon" />
                                    <span>{{ item.meta.title }}</span>
                                </div>
                            </template>
                        </div>
                    </div>
                    <UserMenu />
                </div>
            </header>
            <div class="wrapper">
                <div class="sidebar-container">
                    <Logo />
                    <el-menu :background-color="variables.g_sidebar_bg" :text-color="variables.g_sidebar_menu_color" :active-text-color="variables.g_sidebar_menu_active_color" unique-opened :default-active="$route.meta.activeMenu || $route.path">
                        <transition-group name="sidebar">
                            <SidebarItem v-for="route in $store.state.global.sidebarRoutes" :key="route.path" :item="route" :base-path="route.path" />
                        </transition-group>
                    </el-menu>
                </div>
                <div class="main-container">
                    <div :class="`breadcrumb-container ${scrollTop ? 'shadow' : ''}`">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <transition-group name="breadcrumb">
                                <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path" :to="item.path">{{ item.meta.title }}</el-breadcrumb-item>
                            </transition-group>
                        </el-breadcrumb>
                        <UserMenu />
                    </div>
                    <div class="main">
                        <transition name="main" mode="out-in">
                            <keep-alive :include="$store.state.keepAlive.list">
                                <RouterView />
                            </keep-alive>
                        </transition>
                    </div>
                    <Copyright v-if="$store.state.global.showCopyright" />
                </div>
            </div>
            <el-backtop />
        </div>
        <SearchSidebar />
    </div>
</template>

<script>
import variables from '@/assets/styles/resources/variables.scss'

export default {
    name: 'Layout',
    data() {
        return {
            routePath: '',
            scrollTop: 0
        }
    },
    computed: {
        variables() {
            return variables
        },
        breadcrumbList() {
            let matched = this.$route.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
            if (!(matched[0].name == 'dashboard' && matched[0].path == '/dashboard')) {
                matched = [{ path: '/dashboard', meta: { title: '控制台' }}].concat(matched)
            }
            return matched
        }
    },
    mounted() {
        this.$hotkeys('ctrl+s', e => {
            e.preventDefault()
            this.$store.commit('global/toggleSearch')
        })
        window.addEventListener('scroll', this.onScroll)
    },
    destroyed() {
        window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
        onScroll() {
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        }
    }
}
</script>

<style lang="scss" scoped>
.layout {
    height: 100%;
}
#app-main {
    width: $g-app-width;
    height: 100%;
    margin: 0 auto;
    transition: all 0.2s;
    @if ($g-app-width == 100%) {
        @if ($g-app-min-width != 100%) {
            min-width: $g-app-min-width;
        }
    }
    @else {
        @if ($g-app-max-width) {
            max-width: 100%;
        }
    }
}
header {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: $g-header-height;
    background-color: $g-header-bg;
    color: #fff;
    .header-container {
        width: $g-header-width;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .main {
            display: flex;
            align-items: center;
        }
    }
    @media screen and (max-width: $g-header-width) {
        .header-container {
            width: 100%;
        }
    }
    /deep/ .title {
        position: relative;
        width: inherit;
        height: inherit;
        padding: inherit;
        background-color: inherit;
        .logo {
            width: 50px;
            height: 50px;
        }
        span {
            font-size: 24px;
            letter-spacing: 1px;
        }
    }
    .nav {
        display: flex;
        margin-left: 50px;
        .item {
            margin: 0 10px;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            &.active,
            &:hover {
                background-color: $g_header_nav_active_bg;
            }
            .svg-icon {
                font-size: 20px;
                margin-right: 5px;
            }
        }
    }
    /deep/ .user {
        .user-container {
            color: #fff;
            font-size: 16px;
        }
    }
}
.wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    .sidebar-container {
        position: fixed;
        z-index: 1000;
        top: 0;
        bottom: 0;
        width: $g-sidebar-width;
        background-color: $g-sidebar-bg;
        overflow: auto;
        overscroll-behavior: contain;
        &::-webkit-scrollbar {
            display: none;
        }
        .el-menu {
            border-right: 0;
            padding-top: $g-breadcrumb-height;
        }
    }
    .main-container {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        margin-left: $g-sidebar-width;
        background-color: #f5f7f9;
        box-shadow: 1px 0 0 0 $g-main-bg - 20;
        .breadcrumb-container {
            position: fixed;
            z-index: 999;
            top: 0;
            right: 0;
            left: 50%;
            width: calc(#{$g_app_width} - #{$g_sidebar_width});
            margin-left: $g-sidebar-width;
            transform: translateX(-50%) translateX($g-sidebar-width * -1 / 2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            height: $g-breadcrumb-height;
            background-color: #fff;
            transition: box-shadow 0.5s;
            box-shadow: 0 0 1px 0 #ccc;
            &.shadow {
                box-shadow: 0 10px 10px -10px #ccc;
            }
            /deep/ .el-breadcrumb {
                .el-breadcrumb__item {
                    span {
                        font-weight: normal;
                    }
                    &:last-child span {
                        color: #97a8be;
                    }
                }
            }
        }
        @media screen and (max-width: $g-app-width) {
            .breadcrumb-container {
                width: calc(100% - #{$g_sidebar_width});
            }
        }
        .main {
            height: 100%;
            flex: auto;
            position: relative;
            padding: $g_breadcrumb_height 0 0;
            overflow: hidden;
        }
    }
}
header + .wrapper {
    padding-top: $g-header-height;
    .sidebar-container {
        top: $g-header-height;
        .title {
            display: none;
        }
        .el-menu {
            padding-top: 0;
        }
    }
    .main-container {
        .breadcrumb-container {
            top: $g-header-height;
            .user {
                display: none;
            }
        }
    }
}

// 侧边栏动画
.sidebar-enter-active {
    transition: all 0.3s;
}
.sidebar-enter,
.sidebar-leave-active {
    opacity: 0;
    transform: translateY(20px);
}
.sidebar-leave-active {
    position: absolute;
}

// 面包屑动画
.breadcrumb-enter-active {
    transition: all 0.3s;
}
.breadcrumb-enter,
.breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
}
.breadcrumb-leave-active {
    position: absolute;
}

// 主内容区动画
.main-enter-active,
.main-leave-active {
    transition: all 0.3s;
}
.main-enter {
    opacity: 0;
    margin-left: -20px;
}
.main-leave-to {
    opacity: 0;
    margin-left: 20px;
}
</style>
