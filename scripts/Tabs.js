import BaseComponent from "./BaseComponent.js"

const rootSelector = '[data-js-tabs]'

// Для инициализации логики конкретной группы табов
class Tabs extends BaseComponent {

    selectors = {
        root: rootSelector, // ссылаемся на уже имеющуюся переменную
        button: '[data-js-tabs-button]',
        content: '[data-js-tabs-content]',
    }

    stateClasses = {
        isActive: 'is-active',
    }
// данный объек понадобится когда будем обновлять значения атрибутов DOM эл-тов
    stateAtributes = {
        ariaSelected: 'aria-selected',
        tabIndex: 'tabindex'
    }
// принимает корневой DOM эл-т конкретной группы табов
    constructor(rootElement) {
        super()
        this.rootElement = rootElement
        this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button)
        this.contentElements = this.rootElement.querySelectorAll(this.selectors.content)
// обращемся к массиву группы кнопок табов чтобы потом найти индекс кнопки у которой есть класс is-active 
// определяем индекс активного таба при загрузке
// и весь этот объект помещаем в обертку прокси обьекта для перехвата его свойств при их чтении и записии       
        this.state = this.getProxyState({
            activeTabIndex: [...this.buttonElements]
            .findIndex((buttonElement) => buttonElement.classList.contains(this.stateClasses.isActive))
        }) 
// лимит индекса табов, т.к индексы идут с 0
        this.limitTabIndex = this.buttonElements.length - 1
        this.bindEvenets()
    }

// возвращаем сразу экземпляр встроенного в JS класса Proxy
// initialState - наш объект который мы передаем в target и проксируем
    // getProxyState(initialState) {
    //     return new Proxy(initialState, {
    //         get: (target, prop) => {
    //             return target[prop]
    //         }, // target - проксируемый объект, prop - имя св-ва к которому обращаемся
    //         set: (target, prop, value) => {
    //             target[prop] = value

    //             this.updateUi()

    //             return true // вернуть результат работы метода как булевое значение
    //         },
    //     })
    // }

// обновляем классы DOM эл-тов (кнопка и контент) если их индекс совпадает с индексом активного таба
    updateUi() {
        const { activeTabIndex } = this.state // деструктурируем activeTabIndex

        this.buttonElements.forEach((buttonElement, index) => {
            const isActive = index === activeTabIndex // является ли текущая кнопка активной

            buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
// 2 аргумент должен быть строкой поэтому к булевому типы применяем toString            
            buttonElement.setAttribute(this.stateAtributes.ariaSelected, isActive.toString())
            buttonElement.setAttribute(this.stateAtributes.tabIndex, isActive ? '0' : '-1')
        })

        this.contentElements.forEach((contentElement, index) => {
            const isActive = index === activeTabIndex // является ли текущий контент активным

            contentElement.classList.toggle(this.stateClasses.isActive, isActive)
        })
    }
// при переключении табов по стрелке устанавливаем новый индекс как активный,
// обновляем значения атрибутов DOM эл-тов и берет таб в фокус
    activateTab(newTabIndex) {
        this.state.activeTabIndex = newTabIndex
        this.buttonElements[newTabIndex].focus()
    }
// если мы на первом табе то при повтороном нажатии влево приписываем последний индекс и переходим в конец
    previousTab = () => {
        const newTabIndex = this.state.activeTabIndex === 0
        ? this.limitTabIndex
        : this.state.activeTabIndex - 1

        this.activateTab(newTabIndex)
    }
// если мы на последнем табе то при повтороном нажатии вправо приписываем последний индекс и переходим в начало
    nextTab = () => {
        const newTabIndex = this.state.activeTabIndex === this.limitTabIndex
        ? 0
        : this.state.activeTabIndex + 1

        this.activateTab(newTabIndex)
    }

    firstTab = () => {
        this.activateTab(0)
    }

    lastTab = () => {
    this.activateTab(this.limitTabIndex)
    }

// обновляем индекс активной кнопки и запускаем updateUi
    onButtonClick(buttonIndex) {
        this.state.activeTabIndex = buttonIndex
    }
// обращаемся к объекту event чтобы потом вытащить из него нужные св-ва
    onKeyDown = (event) => {
        
        const { code, metaKey } = event

        
// названия клавиш - код который мы получаем из свойства code
        const action = {
            ArrowLeft: this.previousTab,
            ArrowRight: this.nextTab,
            Home: this.firstTab,
            End: this.lastTab,
        }[code] // получаем ссылки на конкретные методы tabs
// логика под маки. Сочетание на маке command и стрелок работает как Home/End на Windows,
// поэтому методы вызываем соответствующие 
        const isMacHomekey = metaKey && code === 'ArrowLeft'

        if (isMacHomekey) {
            this.firstTab()
             // чтобы обновлялись значения атрибутов
            return
        }

        const  isMacEndkey = metaKey && code === 'ArrowRight'

        if (isMacEndkey) {
            this.lastTab()
            
            return
        }

        action?.() //если action не undefined то вызываем метод, на случай нажатия на другую клавишу 
    }

// при клике на кнопку запускаем функцию onButtonClick и передаем ей индекс нажатой кнопки
    bindEvenets() {
        this.buttonElements.forEach((buttonElement, index) => {
            buttonElement.addEventListener('click', () => this.onButtonClick(index))
        })
        this.rootElement.addEventListener('keydown', this.onKeyDown)
    }
}

// Для инициализации логики всех табов на одной странице
// Он будет заниматься точечным запуском экземпляров класса Tabs
class TabsCollection {

    constructor() {
        this.init()
    }
// находим все группы табов по селектору (у нас 1 группа, но суть таже), перебираем и на каждой
// итерации цикла запускаем класс Tabs содержащий основную логику для каждого отдельного таба
    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Tabs(element)
        })
    }
}

export default TabsCollection

