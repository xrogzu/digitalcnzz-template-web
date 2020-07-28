<template>
    <div class="title" :title="title" @click="$router.push({name: 'dashboard'})">
        <img src="../../../assets/images/logo.png" class="logo">
        <span>{{ title }}</span>
    </div>
</template>

<script>
export default {
    name: 'Logo',
    data() {
        return {
            title: process.env.VUE_APP_TITLE
        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes tolight {
    from { left: -50%; }
    to { left: 150%; }
}
@-webkit-keyframes tolight {
    from { left: -50%; }
    to { left: 150%; }
}
.title {
    position: fixed;
    z-index: 1000;
    top: 0;
    width: inherit;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: $g-breadcrumb-height;
    text-align: center;
    background-color: $g-sidebar-title-bg;
    cursor: pointer;
    overflow: hidden;
    &:hover::before {
        content: '';
        position: absolute;
        width: 50px;
        height: 100%;
        top: 0;
        left: -50%;
        overflow: hidden;
        background:
            -webkit-gradient(
                linear,
                left top,
                right top,
                color-stop(25%, rgba($g-header-bg, 0)),
                color-stop(50%, rgba($g-header-bg, 0.5)),
                color-stop(75%, rgba($g-header-bg, 0))
            );
        background:
            -webkit-linear-gradient(
                left,
                rgba($g-header-bg, 0) 25%,
                rgba($g-header-bg, 0.5) 50%,
                rgba($g-header-bg, 0) 75%
            );
        transform: skewX(-45deg);
        animation: tolight 0.4s 1 linear;
    }
    .logo {
        width: 30px;
        height: 30px;
        margin-right: 10px;
    }
    span {
        display: block;
        font-weight: bold;
        color: #fff;
        @include text-overflow;
    }
}
</style>
