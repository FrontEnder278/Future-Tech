const rootSelector = '[data-js-video-player]'

class VideoPlayer {
    selectors = {
        root: rootSelector,
        video: '[data-js-player-video]',
        panel: '[data-js-video-player-panel]',
        playButton: '[data-js-video-player-button]',
    }

    stateClasses = {
        isActive: 'is-active'
    }

    constructor(rootElement) {
        this.rootElement = rootElement
        this.videoElement = this.rootElement.querySelector(this.selectors.video)
        this.panelElement = this.rootElement.querySelector(this.selectors.panel)
        this.playButtonElement = this.rootElement.querySelector(this.selectors.playButton)
        this.bindEvents()
    }

    onPlayButtonClick = () => {
        this.videoElement.play() // запускаем видео через специальный метод play()
        this.videoElement.controls = true // включаем стандартные органы контроля видео
        this.panelElement.classList.remove(this.stateClasses.isActive) // скрываем панель с элеменатми 
        // контроля при проигрывании видео
    }

    onVideoPause = () => {
        this.videoElement.controls = false
        this.panelElement.classList.add(this.stateClasses.isActive)
    }

    bindEvents() {
        this.playButtonElement.addEventListener('click', this.onPlayButtonClick)
        this.videoElement.addEventListener('pause', this.onVideoPause)
    }
}

class VideoPlayerCollection {
    constructor() {
        this.init()
    }

    init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
        new VideoPlayer(element)
    })
    }
}

export default VideoPlayerCollection

