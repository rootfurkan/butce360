import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentUser } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h2>FinIntel</h2>
            </div>

            <div className="navbar-right">
                <span>
                    Hoş Geldin, {currentUser?.ad} {currentUser?.soyad}
                </span>

                <button onClick={handleLogout}>
                    Çıkış Yap
                </button>
            </div>
        </nav>
    )
}

export default Navbar