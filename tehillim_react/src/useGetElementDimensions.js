import {useLayoutEffect, useState} from 'react'

export default function useGetElementDimensions(element){

    // element = element || {}
    // console.log(element)

    const [dimensions, setDimensions] = useState({width: 0, height: 0})

    useLayoutEffect(() => {
        
        function updateDimensions(){
            setDimensions({
                width: element.clientWidth,
                height: element.clientHeight
            })
            console.log(element)
        }

        window.addEventListener('resize', updateDimensions)

        updateDimensions()

        return () => window.removeEventListener('resize', updateDimensions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return dimensions
}