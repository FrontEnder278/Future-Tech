class Header {
// селекторы по дата атрибутам
    selectors = {
        root: '[data-js-header]',
        overlay: '[data-js-header-overlay]',
        burgerButton: '[data-js-header-burger-button]',
    }
// имена css классов которые будем динамически менять
    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }
//метод который будет автоматически выполнять свой код при инициализации класса
// заполняем перменные для доступа к DOM эл-там.
// 2 и 3 эл-ты ищем уже в контексте первого корневого DOM эл-та поэтому используем this
    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.overlayElement = this.rootElement.querySelector(this.selectors.overlay)
        this.burgerButtonElement = this.rootElement.querySelector(this.selectors.burgerButton)
        this.bindEvents()
    }
// браузер вызывает функцию при клике от имени кнопки и если она в контексте самой кнопки
// то она не будет знать об остальных методах, поэтому используем стрелочную ф-цию чтобы 
// onBurgerButtonClick ссылалась на внешний контекст выполения (class Header) и знала про 
// другие методы
    onBurgerButtonClick = () => {
        this.burgerButtonElement.classList.toggle(this.stateClasses.isActive)
        this.overlayElement.classList.toggle(this.stateClasses.isActive)
        document.documentElement.classList.toggle(this.stateClasses.isLock)
    }

// привязки событий к DOM эл-там
    bindEvents() {
        this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick)
    }
}

export default Header