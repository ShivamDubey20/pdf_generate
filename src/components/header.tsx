import Link from "next/link"

const Header = () => {
    return(
        <header>
            <nav>
                <Link href={"/quizz"}>Sample Quizz</Link>
                <Link href={"/quizz/new"}>New Quizz</Link>
            </nav>
        </header>
    )
}

export default Header;