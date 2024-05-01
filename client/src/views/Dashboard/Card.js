function Card({data, title, icon}) {
    return (
        <div className="card">
            <div className="data">
                <div className="col-lg-7 data-number">
                    <span>  
                        {data}
                    </span>
                </div>
                <div className="col-lg-5 data-icon">
                    {icon}
                </div>
            </div>
            <div className="title">
                <div className="col-3">
                    {title}
                </div>
            </div>
        </div>
    )
}

export default Card;