function Card({ data, title, icon }) {
    return (
        <div className="card mt-3">
            <div className="data">
                <div className="row">
                    <div className="col-md-7 col-8 data-number">{data}</div>
                    <div className="col-md-5 col-4 data-icon">{icon}</div>
                </div>
            </div>
            <div className="title">
                <div className="col-md-12 col-sm-12">{title}</div>
            </div>
        </div>
    );
}

export default Card;
