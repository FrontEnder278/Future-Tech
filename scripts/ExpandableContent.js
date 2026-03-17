import pxToRem from "./utils/PxToRem.js"

const rootSelector = '[data-js-expandable-content]'

class ExpandableContent {
    selectors = {
        root: rootSelector,
        button: '[data-js-expandable-content-button]'
    }

    stateClasses = {
        isExpanded: 'is-expanded'
    }

    // JS параметры анимации для метода animate
    animationParams = {
        duration: 500,
        fill: 'forwards', // Сохранить финальное состояние анимации после её завершения
        easing: 'ease' 
    }

    constructor(rootElement) {
        this.rootElement = rootElement
        this.buttonElement = this.rootElement.querySelector(this.selectors.button)
        this.bindEvents()
    }

    expand() {
        const { offsetHeight, scrollHeight } = this.rootElement // деструктурируем св-ва из rootElement
        
        this.rootElement.classList.add(this.stateClasses.isExpanded)
// метод animate() принимает 2 аргумента: массив ключевых кадров и параметры анимации. Каждый ключевой кадр
// это объект с css св-вами        
        this.rootElement.animate([
            { 
              maxHeight: `${pxToRem(offsetHeight)}rem`, // текущая видимая высота эл-та
            },
            {
              maxHeight: `${pxToRem(scrollHeight)}rem`, // полная высота эл-та, даже если часть скрыта
            }
        ], this.animationParams)
    }

    onButtonClick = () => {
        this.expand()
    }

    bindEvents() {
        this.buttonElement.addEventListener('click', this.onButtonClick)
    }
}

class ExpandableContentCollection {
    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new ExpandableContent(element)
        })
    }
}
export default ExpandableContentCollection