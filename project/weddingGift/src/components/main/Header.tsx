import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {

  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  }

  return (
    <>
      <header>
        <img id="logo" src="/img/assets/logo.webp" alt="Logo" />
        <button onClick={handleNav}>{nav ? "X" : "--"}</button>
      </header>
      <nav className={ nav ? "openNav" : "closeNav"}>
        <ul>
          <li>
            <Link to="/">Main</Link>
            <Link to="/history">Nossa História</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
