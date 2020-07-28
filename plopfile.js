module.exports = function(plop) {
    plop.setGenerator('page-module', require('./plop-templates/page-module/prompt'))
    plop.setGenerator('page', require('./plop-templates/page/prompt'))
    plop.setGenerator('component', require('./plop-templates/component/prompt'))
    plop.setGenerator('store', require('./plop-templates/store/prompt'))
}
