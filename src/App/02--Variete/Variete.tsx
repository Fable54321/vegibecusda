import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Variete() {


    type vegInfo = {
        commodity: string;
        lo_prices: number[];
        hi_prices: number[];
    }

    const [cabbageInfo, setCabbageInfo] = useState<vegInfo>({ commodity: "Chou", lo_prices: [], hi_prices: [] });
    const [squashZuchInfo, setSquashZuchInfo] = useState<vegInfo>({ commodity: "Zucchini", lo_prices: [], hi_prices: [] });
    const [squashYlwInfo, setSquashYlwInfo] = useState<vegInfo>({ commodity: "Courgette Jaune", lo_prices: [], hi_prices: [] });
    const [pepperInfo, setPepperInfo] = useState<vegInfo>({ commodity: "Poivron", lo_prices: [], hi_prices: [] });
    const [broccoliInfo, setBroccoliInfo] = useState<vegInfo>({ commodity: "Brocoli", lo_prices: [], hi_prices: [] });


    type VegResult = {
        market_location_city: string;
        commodity: string;
        item_size: string;
        pkg: string;
        low_price: string;
        high_price: string;
    };

    type outletContextType = {
        vegReports: { results: VegResult[] }[];
        loading: boolean;
    };
    const { vegReports, loading } = useOutletContext<outletContextType>()

    useEffect(() => {
        vegReports.flatMap((report) => report.results).forEach((result) => {
            if (result.commodity === "Cabbage") {
                setCabbageInfo((prev) => {
                    return {
                        commodity: prev.commodity,
                        lo_prices: [...prev.lo_prices, parseInt(result.low_price)],
                        hi_prices: [...prev.hi_prices, parseInt(result.high_price)]
                    }
                })
            }
            else if (result.commodity === "Squash, Zucchini") {
                setSquashZuchInfo((prev) => {
                    return {
                        commodity: prev.commodity,
                        lo_prices: [...prev.lo_prices, parseInt(result.low_price)],
                        hi_prices: [...prev.hi_prices, parseInt(result.high_price)]
                    }
                })
            }
            else if (result.commodity === "Squash, Yellow Straightneck") {
                setSquashYlwInfo((prev) => {
                    return {
                        commodity: prev.commodity,
                        lo_prices: [...prev.lo_prices, parseInt(result.low_price)],
                        hi_prices: [...prev.hi_prices, parseInt(result.high_price)]
                    }
                })
            }
            else if (result.commodity === "Peppers, Bell Type") {
                setPepperInfo((prev) => {
                    return {
                        commodity: prev.commodity,
                        lo_prices: [...prev.lo_prices, parseInt(result.low_price)],
                        hi_prices: [...prev.hi_prices, parseInt(result.high_price)]
                    }
                })
            }
            else if (result.commodity === "Broccoli") {
                setBroccoliInfo((prev) => {
                    return {
                        commodity: prev.commodity,
                        lo_prices: [...prev.lo_prices, parseInt(result.low_price)],
                        hi_prices: [...prev.hi_prices, parseInt(result.high_price)]
                    }
                })
            }
        })
    }, [vegReports])

    useEffect(() => {
        console.log(cabbageInfo);
        console.log(squashZuchInfo);
        console.log(squashYlwInfo);
        console.log(pepperInfo);
        console.log(broccoliInfo);
    }, [cabbageInfo, squashZuchInfo, squashYlwInfo, pepperInfo, broccoliInfo]);



    return (
        <section className="w-[min(100%,_40rem)] flex flex-col items-center px-[0.75rem] gap-[1rem]">

            {loading ? (
                <p>Loading...</p>
            ) : vegReports.length === 0 ||
                vegReports.every((report) => report.results.length === 0) ? (
                <p>Les rapports pour la date sélectionnée ne sont pas disponibles</p>
            ) : (
                <>
                    <ul className="flex flex-col gap-[0.25rem] w-[min(100%,_40rem)]">
                        <li className="flex flex-col gap-[0.75rem] bg-white p-[0.75rem] rounded-[0.75rem] border-4 border-green-400 border-solid">

                            <h3 className="font-bold text-[1.5rem] text-center">{cabbageInfo.commodity}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-center">Prix bas moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(cabbageInfo.lo_prices.reduce((a, b) => a + b, 0) / cabbageInfo.lo_prices.length).toFixed(2)}</span> usd</p>
                                <p className="text-center">Prix haut moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(cabbageInfo.hi_prices.reduce((a, b) => a + b, 0) / cabbageInfo.hi_prices.length).toFixed(2)}</span> usd</p>
                            </div>
                        </li>
                        <li className="flex flex-col gap-[0.75rem] bg-white p-[0.75rem] rounded-[0.75rem] border-4 border-green-400 border-solid">

                            <h3 className="text-[1.5rem] font-bold text-center">{squashZuchInfo.commodity}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-center">Prix bas moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(squashZuchInfo.lo_prices.reduce((a, b) => a + b, 0) / squashZuchInfo.lo_prices.length).toFixed(2)}</span> usd</p>
                                <p className="text-center">Prix haut moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(squashZuchInfo.hi_prices.reduce((a, b) => a + b, 0) / squashZuchInfo.hi_prices.length).toFixed(2)}</span> usd</p>
                            </div>
                        </li>
                        <li className="flex flex-col gap-[0.75rem] bg-white p-[0.75rem] rounded-[0.75rem] border-4 border-green-400 border-solid">

                            <h3 className="text-[1.5rem] font-bold text-center">{squashYlwInfo.commodity}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-center">Prix bas moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(squashYlwInfo.lo_prices.reduce((a, b) => a + b, 0) / squashYlwInfo.lo_prices.length).toFixed(2)}</span> usd</p>
                                <p className="text-center">Prix haut moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(squashYlwInfo.hi_prices.reduce((a, b) => a + b, 0) / squashYlwInfo.hi_prices.length).toFixed(2)}</span> usd</p>
                            </div>
                        </li>
                        <li className="flex flex-col gap-[0.75rem] bg-white p-[0.75rem] rounded-[0.75rem] border-4 border-green-400 border-solid">
                            <h3 className="text-[1.5rem] font-bold text-center">{pepperInfo.commodity}</h3>
                            <div className="flex items-center justify-between">


                                <p className="text-center">Prix bas moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(pepperInfo.lo_prices.reduce((a, b) => a + b, 0) / pepperInfo.lo_prices.length).toFixed(2)}</span> usd</p>
                                <p className="text-center">Prix haut moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(pepperInfo.hi_prices.reduce((a, b) => a + b, 0) / pepperInfo.hi_prices.length).toFixed(2)}</span> usd</p>
                            </div>
                        </li>
                        <li className="flex flex-col gap-[0.75rem] bg-white p-[0.75rem] rounded-[0.75rem] border-4 border-green-400 border-solid">

                            <h3 className="text-[1.5rem] font-bold text-center">{broccoliInfo.commodity}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-center">Prix bas moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(broccoliInfo.lo_prices.reduce((a, b) => a + b, 0) / broccoliInfo.lo_prices.length).toFixed(2)}</span> usd</p>
                                <p className="text-center">Prix haut moyen: <br />$<span className="font-bold text-center text-[1.2rem]">{(broccoliInfo.hi_prices.reduce((a, b) => a + b, 0) / broccoliInfo.hi_prices.length).toFixed(2)}</span> usd</p>
                            </div>
                        </li>
                    </ul>

                </>
            )}
        </section>
    );
}

export default Variete;