export default function CoupleHistory() {

    const somethingImage = "/img/something.webp";

    return (
        <>
            <div>
                <h1 className="title">O Começo</h1>
                <img className="couplesImage" src={somethingImage} alt="couplesImage"/>
                <p className="text">Um curto texto de como tudo começou.</p>

                <h1 className="title">Nossos Gostos</h1>
                <img className="couplesImage" src={somethingImage} alt="couplesImage"/>
                <p className="text">Um curto texto sobre oque gostam.</p>

                <h1 className="title">Nossos Planos</h1>
                <img className="couplesImage" src={somethingImage} alt="couplesImage"/>
                <p className="text">Um curto texto de seus futuros planos.</p>

                <h1 className="title">Agradecimento</h1>
                <img className="couplesImage" src={somethingImage} alt="couplesImage"/>
                <p className="text">Um curto texto de agradecimento.</p>
            </div>
        </>
    )
}