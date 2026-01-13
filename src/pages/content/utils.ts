import { documentPadding } from './consts'

export function attachEventsToContainer($container: HTMLElement) {
    $container.addEventListener('mousedown', (event) => {
        event.stopPropagation()
    })
    $container.addEventListener('mouseup', (event) => {
        event.stopPropagation()
    })
    $container.addEventListener('touchstart', (event) => {
        event.stopPropagation()
    })
    $container.addEventListener('touchend', (event) => {
        event.stopPropagation()
    })
}

export function calculateMaxXY($popupCard: HTMLElement): number[] {
    const { innerWidth, innerHeight, scrollX, scrollY } = window
    const { scrollLeft, scrollTop } = document.documentElement
    const { width, height } = $popupCard.getBoundingClientRect()
    const maxX = (scrollX || scrollLeft) + innerWidth - width - documentPadding
    const maxY = (scrollY || scrollTop) + innerHeight - height - documentPadding
    return [maxX, maxY]
}
