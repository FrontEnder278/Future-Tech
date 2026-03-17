const rootSelector = '[data-js-input-mask]'

class inputMask {
    constructor(rootElement) {
        this.rootElement = rootElement
        this.init()
    }

    init() {
        // проверяем что библиотека исправна, подключена верно и готова к работе. 
        // через window пишем чтобы было очевиднее что IMask глобальная сущность
        const isLibReady = typeof window.IMask !== undefined

        if (isLibReady) {
           window.IMask(this.rootElement, {
            mask: this.rootElement.dataset.jsInputMask
           }) // передаем ссылку на сам DOM элемент нашей маске
        } else {
           console.error(`Библиотека "imask" не подключена`)
        }
    }
}

class inputMaskColletion {
    constructor() {
        this.init()
    }
    
    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new inputMask(element)
        })
    }
}

export default inputMaskColletion

// IMask(
//   document.getElementById('phone-mask'),
//   {
//     mask: '+{7}(000)000-00-00'
//   }
// )  вот так выглядит инициализации библиотеки