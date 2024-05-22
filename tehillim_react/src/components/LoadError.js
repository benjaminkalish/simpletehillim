import React from 'react'
import { Link, useRouteError } from 'react-router-dom'
import '../css/LoadError.css'

export default function LoadError() {
    const error = useRouteError()
    console.error(`${error.status || ''} ${error.message}`)
    return (
        <div id='loadError'>
            <span>Sorry. We were unable to load this page.</span>
            <Link id='toHome' to={'/'}>back to home</Link>
        </div>

    )
}
