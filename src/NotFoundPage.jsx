import { Link } from 'react-router-dom'
import './css/notFoundPage.css'

export function NotFoundPage () {
    return (
        <div className='errorText'>
            <p><strong>404 Error Found</strong></p>
            <div className='buttonToHP'>
                <button>
                    <Link to='/'>HomePage</Link>
                </button>
            </div>
        </div>
    )
}