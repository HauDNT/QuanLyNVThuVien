import {Link} from 'react-router-dom';
import "../styles/PageNotFound.scss";

function PageNotFound() {
    return (
        <div id="notfound">
            <div class="notfound">
                <div class="notfound-404">
                    <h1>Oops!</h1>
                </div>
                <h2>404 - Page not found</h2>
                <p>Trang bạn đang tìm kiếm có thể đã bị xóa do tên đã thay đổi hoặc tạm thời không khả dụng.</p>
                <Link className='backhome' to='/'>Trở về trang chủ</Link>
            </div>
        </div>
    );
}

export default PageNotFound;