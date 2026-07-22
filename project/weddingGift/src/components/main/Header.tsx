import { useState } from "react";

export default function Header() {

  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  }

  return (
    <>
      <header>
        <span>WeddingGift</span>
        <button onClick={handleNav}>{nav ? "X" : "--"}</button>
      </header>
      <nav className={ nav ? "openNav" : "closeNav"}>
        <ul>
          <li>
            <a href="/">Main</a>
          </li>
        </ul>
      </nav>
    </>
  );
}
