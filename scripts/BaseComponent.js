class BaseComponent {

        constructor() {
            if (this.constructor === BaseComponent) {
                throw new Error('Невозможно создать экземпляр абстрактного класса BaseComponent')
            }
        }
    getProxyState(initialState) {
        return new Proxy(initialState, {
            get: (target, prop) => {
                return target[prop]
            },
            set: (target, prop, newValue) => {
                const oldValue = target[prop] // изначальное значение объекта
                target[prop] = newValue

                if (oldValue !== newValue)  { // если новое значение не равно старому то обновляем 
                    this.updateUi()
                }
                
                return true
            }
        })
    }

    // перерисовка UI в ответ на обновление состояния
    updateUi() {
        throw new Error('Необходимо реализовать метод updateUi()!')
    }
}

export default BaseComponent
