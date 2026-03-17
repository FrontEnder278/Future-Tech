import BaseComponent from "./BaseComponent.js"
import MatchMedia from "./MatchMedia.js"

const rootSelector = '[data-js-select]'

class Select extends BaseComponent {

    selectors = {
        root: rootSelector,
        originalControl: '[data-js-select-original-control]',
        button: '[data-js-select-button]',
        dropdown: '[data-js-select-dropdown]',
        option: '[data-js-select-option]',
    }

    stateClasses = {
        isExpanded: 'is-expanded',
        isSelected: 'is-selected',
        isCurrent: 'is-current',
        isOnTheLeftSide: 'is-on-the-left-side',
        isOnTheRightSide: 'is-on-the-right-side',
    }

    stateAtributes = {
        ariaExpanded: 'aria-expanded',
        ariaSelected: 'aria-selected',
        ariaActiveDescendant: 'aria-activedescendant' // активный, но еще не выбранный элемент при переборе 
        // с клавиш ArrowUp и ArrowDown
    }

    initialState = {
        isExpanded: false, // в начале dropdown не активен
        currentOptionIndex: null, // индекс текущей опции is-current по которой перемещаются стрелками. 
        // В начале она совпадает с selected опцией
        selectedOptionElement: null, // ссылка на конкретный DOM эл-т выбранной опции селекта is-selected
    }

    constructor(rootElement) {
        super()
        this.rootElement = rootElement
        this.originalControlElement = this.rootElement.querySelector(this.selectors.originalControl)
        this.buttonElement = this.rootElement.querySelector(this.selectors.button)
        this.dropdownElement = this.rootElement.querySelector(this.selectors.dropdown)
        this.optionElements = this.rootElement.querySelectorAll(this.selectors.option)
        this.state = this.geProxyState({
            ...this.initialState,
            currentOptionIndex: this.originalControlElement.selectedIndex,
            selectedOptionElement: this.optionElements[this.originalControlElement.selectedIndex]
        }) // объект состояния
        this.fixDropdownPosition()
        this.updateTabIndexes()
        this.bindEvents()
    }

    updateUi() {
        const { isExpanded,
               currentOptionIndex,
               selectedOptionElement
        } = this.state

        const newSelectedOptionValue = selectedOptionElement.textContent.trim()

        const updateOriginalControl = () => {
            this.originalControlElement.value = newSelectedOptionValue
        }

        const updateButtonControl = () => {
            this.buttonElement.textContent = newSelectedOptionValue
            this.buttonElement.classList.toggle(this.stateClasses.isExpanded, isExpanded)
            this.buttonElement.setAttribute(this.stateAtributes.ariaExpanded, isExpanded)
            this.buttonElement.setAttribute(
                this.stateAtributes.ariaActiveDescendant, 
                this.optionElements[currentOptionIndex].id
            )
        }

        const updateDropdownControl = () => {
            this.dropdownElement.classList.toggle(this.stateClasses.isExpanded, isExpanded)
        }

        const updateOptions = () => {
            this.optionElements.forEach((optionElement, index) => {
                const isCurrent = currentOptionIndex === index
                const isSelected = selectedOptionElement === optionElement

                optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent)
                optionElement.classList.toggle(this.stateClasses.isSelected, isSelected)
                optionElement.setAttribute(this.stateAtributes.ariaSelected, isSelected)
            })
        }

        updateOriginalControl()
        updateButtonControl()
        updateDropdownControl()
        updateOptions()
    }

    fixDropdownPosition() {
        const viewportWidth = document.documentElement.clientWidth
        const halfViewportX = viewportWidth / 2 // центр вьюпорта по Х

        const { width, x } = this.buttonElement.getBoundingClientRect() // обращаемся к кнопке селекта
        // и через getBoundingClientRect() получаем параметры размеров и координат, в частности ширины кнопки
        // и ее координату левого края по Х относительно вьюпорта

        const buttonCenterX = x + width / 2 // координата центра кнопки по Х
        // левый край кнопки + половина ширины кнопки = центр кнопки
        const isButtonOnTheLeftViewportSide = buttonCenterX < halfViewportX // если центр кнопки левее
        // середины вьюпорта то кнопка позиционируется слева

        this.dropdownElement.classList.toggle(
            this.stateClasses.isOnTheLeftSide,
             isButtonOnTheLeftViewportSide)

             this.dropdownElement.classList.toggle(
            this.stateClasses.isOnTheRightSide,
             !isButtonOnTheLeftViewportSide)
     }

// перенос переменной isMobileDevice в параметр метода позволяет при вызове передавать аргументы true // false
// и самому говорить методу считать ли ус-во мобильным или нет
     updateTabIndexes(isMobileDevice = MatchMedia.mobile.matches) {
        this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1
        this.buttonElement.tabIndex = isMobileDevice ? -1 : 0
     }

     onMobileMatchMediaChange = (event) => {
        this.updateTabIndexes(event.matches)
     } // при измененении состояния matches media выражения вызываем метод обновления табиндексов
     // event.matches - новое состояние медаи-запроса

     toggleExpandedState() {
        this.state.isExpanded = !this.state.isExpanded // установка всегда протиположного значения
     }

     expand() {
        this.state.isExpanded = true
     }

     Collapse() {
        this.state.isExpanded = false
     } 

     onButtonClick = () => {
        this.toggleExpandedState()
     }

     onClick = (event) => {
        const { target } = event

        const isOutSideDropdownClick = target.closest(this.selectors.dropdown) !== this.dropdownElement
        const isButtonClick = target === this.buttonElement // если целевой элемент оказался кнопкой

        if (!isButtonClick && isOutSideDropdownClick) {
            this.Collapse()
            return
        } // если клик не по кнопке и целевой элемент не равен dropdownElement

        const isOptionClick = target.matches(this.selectors.option)

        if (isOptionClick) {
            this.state.selectedOptionElement = target
            this.state.currentOptionIndex = [...this.optionElements]
            .findIndex((optionElement) => optionElement === target)
            this.Collapse()
        }
     }

    get isNeedToExpand() {
        const isButtonFocused = document.activeElement === this.buttonElement

        return (!this.state.isExpanded && isButtonFocused)
     } // поле activeElement объекта document хранит ссылку на элемент который сейчас в фокусе. 
     // если такого эл-та нет - null. метод возвращает true если дропдаун меню закрыто и в фокусе кнопка дропдауна

     selectCurrentOption() {
        this.state.selectedOptionElement = this.optionElements[this.state.currentOptionIndex]
     }

     onArrowUpKewDown = () => {
        if (this.isNeedToExpand) {
            this.expand()
            return
        }

        if (this.state.currentOptionIndex > 0) {
            this.state.currentOptionIndex--
        }
     }

     onArrowDownKeyDown = () => {
        if (this.isNeedToExpand) {
            this.expand()
            return
        }

        if (this.state.currentOptionIndex < this.optionElements.length - 1) {
            this.state.currentOptionIndex++
        }
     }

     onSpaceKeyDown = () => {
        if (this.isNeedToExpand) {
            this.expand()
            return
        }

        this.selectCurrentOption()
        this.Collapse()
     }

     onEnterKeyDown = () => {
        if (this.isNeedToExpand) {
            this.expand()
            return
        }

        this.selectCurrentOption()
        this.Collapse()
     }

     onKeyDown = (event) => {
        const { code } = event

        const action = {
            ArrowUp: this.onArrowUpKewDown,
            ArrowDown: this.onArrowDownKeyDown,
            Space: this.onSpaceKeyDown,
            Enter: this.onEnterKeyDown,
        }[code] // В ключах прописаны имена свойств которые могут прийти из свойства code у объекта event

        if (action) {
            event.preventDefault()
            action() // вызов соответсвующей функции у action
        }
     }

     onOriginalCotrolChange = () => {
        this.state.selectedOptionElement = this.optionElements[this.originalControlElement.selectedIndex]
     }

     bindEvents() {
        MatchMedia.mobile.addEventListener('change', this.onMobileMatchMediaChange)
        this.buttonElement.addEventListener('click', this.onButtonClick)
        document.addEventListener('click', this.onClick)
        this.rootElement.addEventListener('keydown', this.onKeyDown)
        this.originalControlElement.addEventListener('change', this.onOriginalCotrolChange)
     }
}

class SelectCollection {
    constructor() {
        this.init()
    }
    
    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Select(element)
        });
    }
}

export default SelectCollection

