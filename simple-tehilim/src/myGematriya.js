import { gematriya } from '@hebcal/core'

export default function myGematriya(n) {
    if(n <= 10){
        return gematriya(n)[0]
    }
    else {
        return gematriya(n)
    }
}