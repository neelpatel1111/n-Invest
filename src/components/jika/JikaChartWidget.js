import React from 'react'

const JikaChartWidget = ({symbol}) => {
    return (
        <>
            <iframe
                referrerPolicy="origin"
                width="100%"
                height="480"
                style={{
                    background: "#FFFFFF",
                    padding: "10px",
                }}
                className='border rounded'
                src={`https://jika.io/embed/area-chart?symbol=${symbol}.NS&selection=one_month&closeKey=close&boxShadow=false&graphColor=1652f0&textColor=161c2d&backgroundColor=FFFFFF&fontFamily=Nunito`}
            />

        </>
    )
}

export default JikaChartWidget
