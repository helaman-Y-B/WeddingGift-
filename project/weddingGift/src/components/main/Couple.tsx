export default function Couple() {
  const somethingImage = "/img/something.webp";

  return (
    <>
      <div id="coupleInfo">
        <img src={somethingImage} alt="Couples image" />
        <div id="infos">
          <h2>Couples name</h2>
          <p>Couples history link</p>
        </div>
      </div>
    </>
  );
}
