import pxToRem from "./utils/PxToRem.js"

const MatchMedia = {
    mobile: window.matchMedia(`(width <= ${pxToRem(767.98)}rem)`),
}

export default MatchMedia