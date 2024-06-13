import { Link } from 'react-router-dom';

function PageNotFound() {
    return (
        <div id="notfound" className="col-md-12 col-sm-12">
            <div class="notfound">
                <div class="notfound-404">
                    <h1>Oops!</h1>
                </div>
                <h2>404 - Page not found</h2>
                <p>
                    Trang bạn đang tìm kiếm có thể đã bị xóa do tên đã thay đổi, 
                    không đủ quyền hạn truy cập
                    hoặc tạm thời không khả dụng.
                </p>
                <Link className="backhome btn btn-primary" to="/">
                    Trở về trang chủ
                </Link>
            </div>
        </div>
    );
}

export default PageNotFound;
