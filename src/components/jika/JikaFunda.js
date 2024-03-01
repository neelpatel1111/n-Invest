import React from 'react'

const JikaFunda = ({ symbol }) => {
    return (
        <iframe
            referrerPolicy="origin"
            width="100%"
            height="350"
            style={{
                background: "#FFFFFF",
                padding: "10px",
            }}
            className='border rounded'
            // style={{ background: "#FFFFFF", padding: "10px", border: "none", borderRadius: "5px", boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)" }}
            src={`https://jika.io/embed/fundamentals-table?symbols=${symbol}.NS&keys=Market Cap,Net Income,Revenue,Pre-Tax Profit Margin,EBITDA,PE Ratio&reportingPeriod=quarter&from=2019&to=2024&sortMethod=years&boxShadow=false&textColor=161c2d&backgroundColor=FFFFFF&fontFamily=Nunito`}
        />
    )
}

export default JikaFunda
