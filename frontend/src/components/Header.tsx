import styles from "../styles/header.module.css"

const Header = () => {
    return (
        <div className={styles.HeaderContainer}>
            <span className={styles.Title}><h1>Dashboard</h1></span>
        </div>
    )
}

export default Header
