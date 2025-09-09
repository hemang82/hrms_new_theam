import React from 'react'

const SecondHeader = () => {
    return (
        <div className="navbar-custom">
            <div className="topbar">
                <div className="topbar-menu d-flex align-items-center gap-1">
                    {/* Topbar Brand Logo */}
                    <div className="logo-box">
                        {/* Brand Logo Light */}
                        <a href="index.html" className="logo-light">
                            <img src="assets/images/logo-light.png" alt="logo" className="logo-lg" />
                            <img src="assets/images/logo-sm.png" alt="small logo" className="logo-sm" />
                        </a>
                        {/* Brand Logo Dark */}
                        <a href="index.html" className="logo-dark">
                            <img src="assets/images/logo-dark.png" alt="dark logo" className="logo-lg" />
                            <img src="assets/images/logo-sm.png" alt="small logo" className="logo-sm" />
                        </a>
                    </div>
                    {/* Sidebar Menu Toggle Button */}
                    <button className="button-toggle-menu">
                        <i className="mdi mdi-menu" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="dropdown d-none d-xl-block">
                        <a className="nav-link dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                            Create New
                            <i className="mdi mdi-chevron-down ms-1" />
                        </a>
                        <div className="dropdown-menu">
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item">
                                <i className="fe-briefcase me-1" />
                                <span>New Projects</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item">
                                <i className="fe-user me-1" />
                                <span>Create Users</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item">
                                <i className="fe-bar-chart-line- me-1" />
                                <span>Revenue Report</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item">
                                <i className="fe-settings me-1" />
                                <span>Settings</span>
                            </a>
                            <div className="dropdown-divider" />
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item">
                                <i className="fe-headphones me-1" />
                                <span>Help &amp; Support</span>
                            </a>
                        </div>
                    </div>
                    {/* Mega Menu Dropdown */}
                    <div className="dropdown dropdown-mega d-none d-xl-block">
                        <a className="nav-link dropdown-toggle waves-effect waves-light" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                            Mega Menu
                            <i className="mdi mdi-chevron-down  ms-1" />
                        </a>
                        <div className="dropdown-menu dropdown-megamenu">
                            <div className="row">
                                <div className="col-sm-8">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <h5 className="text-dark mt-0">UI Components</h5>
                                            <ul className="list-unstyled megamenu-list">
                                                <li>
                                                    <a href="widgets.html">Widgets</a>
                                                </li>
                                                <li>
                                                    <a href="extended-nestable.html">Nestable List</a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);">Range Sliders</a>
                                                </li>
                                                <li>
                                                    <a href="pages-gallery.html">Masonry Items</a>
                                                </li>
                                                <li>
                                                    <a href="extended-sweet-alert.html">Sweet Alerts</a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);">Treeview Page</a>
                                                </li>
                                                <li>
                                                    <a href="extended-tour.html">Tour Page</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4">
                                            <h5 className="text-dark mt-0">Applications</h5>
                                            <ul className="list-unstyled megamenu-list">
                                                <li>
                                                    <a href="ecommerce-products.html">eCommerce Pages</a>
                                                </li>
                                                <li>
                                                    <a href="crm-dashboard.html">CRM Pages</a>
                                                </li>
                                                <li>
                                                    <a href="email-inbox.html">Email</a>
                                                </li>
                                                <li>
                                                    <a href="apps-calendar.html">Calendar</a>
                                                </li>
                                                <li>
                                                    <a href="contacts-list.html">Team Contacts</a>
                                                </li>
                                                <li>
                                                    <a href="task-kanban-board.html">Task Board</a>
                                                </li>
                                                <li>
                                                    <a href="email-templates.html">Email Templates</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4">
                                            <h5 className="text-dark mt-0">Extra Pages</h5>
                                            <ul className="list-unstyled megamenu-list">
                                                <li>
                                                    <a href="javascript:void(0);">Left Sidebar with User</a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);">Menu Collapsed</a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);">Small Left Sidebar</a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);">New Header Style</a>
                                                </li>
                                                <li>
                                                    <a href="pages-search-results.html">Search Result</a>
                                                </li>
                                                <li>
                                                    <a href="pages-gallery.html">Gallery Pages</a>
                                                </li>
                                                <li>
                                                    <a href="pages-coming-soon.html">Maintenance &amp; Coming Soon</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="text-center mt-3">
                                        <h3 className="text-dark">Special Discount Sale!</h3>
                                        <h4>Save up to 70% off.</h4>
                                        <a href="https://1.envato.market/uboldadmin" target="_blank" className="btn btn-primary rounded-pill mt-3">Download Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="topbar-menu d-flex align-items-center">
                    {/* Topbar Search Form */}
                    <li className="app-search dropdown me-3 d-none d-lg-block">
                        <form>
                            <input type="search" className="form-control rounded-pill" placeholder="Search..." id="top-search" />
                            <span className="fe-search search-icon font-22" />
                        </form>
                        <div className="dropdown-menu dropdown-menu-animated dropdown-lg" id="search-dropdown">
                            {/* item*/}
                            <div className="dropdown-header noti-title">
                                <h5 className="text-overflow mb-2">Found 22 results</h5>
                            </div>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                <i className="fe-home me-1" />
                                <span>Analytics Report</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                <i className="fe-aperture me-1" />
                                <span>How can I help you?</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                <i className="fe-settings me-1" />
                                <span>User profile settings</span>
                            </a>
                            {/* item*/}
                            <div className="dropdown-header noti-title">
                                <h6 className="text-overflow mb-2 text-uppercase">Users</h6>
                            </div>
                            <div className="notification-list">
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <div className="d-flex align-items-start">
                                        <img className="d-flex me-2 rounded-circle" src="assets/images/users/user-2.jpg" alt="Generic placeholder image" height={32} />
                                        <div className="w-100">
                                            <h5 className="m-0 font-14">Erwin E. Brown</h5>
                                            <span className="font-12 mb-0">UI Designer</span>
                                        </div>
                                    </div>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <div className="d-flex align-items-start">
                                        <img className="d-flex me-2 rounded-circle" src="assets/images/users/user-5.jpg" alt="Generic placeholder image" height={32} />
                                        <div className="w-100">
                                            <h5 className="m-0 font-14">Jacob Deo</h5>
                                            <span className="font-12 mb-0">Developer</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </li>
                    {/* Fullscreen Button */}
                    <li className="d-none d-md-inline-block">
                        <a className="nav-link waves-effect waves-light" href="#" data-toggle="fullscreen">
                            <i className="fe-maximize font-22" />
                        </a>
                    </li>
                    {/* Search Dropdown (for Mobile/Tablet) */}
                    <li className="dropdown d-lg-none">
                        <a className="nav-link dropdown-toggle waves-effect waves-light arrow-none" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                            <i className="ri-search-line font-22" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-animated dropdown-lg p-0">
                            <form className="p-3">
                                <input type="search" className="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                            </form>
                        </div>
                    </li>
                    {/* App Dropdown */}
                    <li className="dropdown d-none d-md-inline-block">
                        <a className="nav-link dropdown-toggle waves-effect waves-light arrow-none" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                            <i className="fe-grid font-22" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg p-0">
                            <div className="p-2">
                                <div className="row g-0">
                                    <div className="col">
                                        <a className="dropdown-icon-item" href="#">
                                            <img src="assets/images/brands/slack.png" alt="slack" />
                                            <span>Slack</span>
                                        </a>
                                    </div>
                                    <div className="col">
                                        <a className="dropdown-icon-item" href="#">
                                            <img src="assets/images/brands/github.png" alt="Github" />
                                            <span>GitHub</span>
                                        </a>
                                    </div>
                                    <div className="col">
                                        <a className="dropdown-icon-item" href="#">
                                            <img src="assets/images/brands/dribbble.png" alt="dribbble" />
                                            <span>Dribbble</span>
                                        </a>
                                    </div>
                                </div>
                                <div className="row g-0">
                                    <div className="col">
                                        <a className="dropdown-icon-item" href="#">
                                            <img src="assets/images/brands/bitbucket.png" alt="bitbucket" />
                                            <span>Bitbucket</span>
                                        </a>
                                    </div>
                                    <div className="col">
                                        <a className="dropdown-icon-item" href="#">
                                            <img src="assets/images/brands/dropbox.png" alt="dropbox" />
                                            <span>Dropbox</span>
                                        </a>
                                    </div>
                                    <div className="col">
                                        <a className="dropdown-icon-item" href="#">
                                            <img src="assets/images/brands/g-suite.png" alt="G Suite" />
                                            <span>G Suite</span>
                                        </a>
                                    </div>
                                </div> {/* end row*/}
                            </div>
                        </div>
                    </li>
                    {/* Language flag dropdown  */}
                    <li className="dropdown d-none d-md-inline-block">
                        <a className="nav-link dropdown-toggle waves-effect waves-light arrow-none" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                            <img src="assets/images/flags/us.jpg" alt="user-image" className="me-0 me-sm-1" height={18} />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated">
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item">
                                <img src="assets/images/flags/germany.jpg" alt="user-image" className="me-1" height={12} /> <span className="align-middle">German</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item">
                                <img src="assets/images/flags/italy.jpg" alt="user-image" className="me-1" height={12} /> <span className="align-middle">Italian</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item">
                                <img src="assets/images/flags/spain.jpg" alt="user-image" className="me-1" height={12} /> <span className="align-middle">Spanish</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item">
                                <img src="assets/images/flags/russia.jpg" alt="user-image" className="me-1" height={12} /> <span className="align-middle">Russian</span>
                            </a>
                        </div>
                    </li>
                    {/* Notofication dropdown */}
                    <li className="dropdown notification-list">
                        <a className="nav-link dropdown-toggle waves-effect waves-light arrow-none" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                            <i className="fe-bell font-22" />
                            <span className="badge bg-danger rounded-circle noti-icon-badge">9</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg py-0">
                            <div className="p-2 border-top-0 border-start-0 border-end-0 border-dashed border">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h6 className="m-0 font-16 fw-semibold"> Notification</h6>
                                    </div>
                                    <div className="col-auto">
                                        <a href="javascript: void(0);" className="text-dark text-decoration-underline">
                                            <small>Clear All</small>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="px-1" style={{ maxHeight: 300 }} data-simplebar>
                                <h5 className="text-muted font-13 fw-normal mt-2">Today</h5>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item p-0 notify-item card unread-noti shadow-none mb-1">
                                    <div className="card-body">
                                        <span className="float-end noti-close-btn text-muted"><i className="mdi mdi-close" /></span>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="notify-icon bg-primary">
                                                    <i className="mdi mdi-comment-account-outline" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 text-truncate ms-2">
                                                <h5 className="noti-item-title fw-semibold font-14">Datacorp <small className="fw-normal text-muted ms-1">1 min ago</small></h5>
                                                <small className="noti-item-subtitle text-muted">Caleb Flakelar commented on Admin</small>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item p-0 notify-item card read-noti shadow-none mb-1">
                                    <div className="card-body">
                                        <span className="float-end noti-close-btn text-muted"><i className="mdi mdi-close" /></span>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="notify-icon bg-info">
                                                    <i className="mdi mdi-account-plus" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 text-truncate ms-2">
                                                <h5 className="noti-item-title fw-semibold font-14">Admin <small className="fw-normal text-muted ms-1">1 hours ago</small></h5>
                                                <small className="noti-item-subtitle text-muted">New user registered</small>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <h5 className="text-muted font-13 fw-normal mt-0">Yesterday</h5>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item p-0 notify-item card read-noti shadow-none mb-1">
                                    <div className="card-body">
                                        <span className="float-end noti-close-btn text-muted"><i className="mdi mdi-close" /></span>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="notify-icon">
                                                    <img src="assets/images/users/avatar-2.jpg" className="img-fluid rounded-circle" alt />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 text-truncate ms-2">
                                                <h5 className="noti-item-title fw-semibold font-14">Cristina Pride <small className="fw-normal text-muted ms-1">1 day ago</small></h5>
                                                <small className="noti-item-subtitle text-muted">Hi, How are you? What about our next meeting</small>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <h5 className="text-muted font-13 fw-normal mt-0">30 Dec 2021</h5>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item p-0 notify-item card read-noti shadow-none mb-1">
                                    <div className="card-body">
                                        <span className="float-end noti-close-btn text-muted"><i className="mdi mdi-close" /></span>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="notify-icon bg-primary">
                                                    <i className="mdi mdi-comment-account-outline" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 text-truncate ms-2">
                                                <h5 className="noti-item-title fw-semibold font-14">Datacorp</h5>
                                                <small className="noti-item-subtitle text-muted">Caleb Flakelar commented on Admin</small>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item p-0 notify-item card read-noti shadow-none mb-1">
                                    <div className="card-body">
                                        <span className="float-end noti-close-btn text-muted"><i className="mdi mdi-close" /></span>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="notify-icon">
                                                    <img src="assets/images/users/avatar-4.jpg" className="img-fluid rounded-circle" alt />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 text-truncate ms-2">
                                                <h5 className="noti-item-title fw-semibold font-14">Karen Robinson</h5>
                                                <small className="noti-item-subtitle text-muted">Wow ! this admin looks good and awesome design</small>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <div className="text-center">
                                    <i className="mdi mdi-dots-circle mdi-spin text-muted h3 mt-0" />
                                </div>
                            </div>
                            {/* All*/}
                            <a href="javascript:void(0);" className="dropdown-item text-center text-primary notify-item border-top border-light py-2">
                                View All
                            </a>
                        </div>
                    </li>
                    {/* Light/Darj Mode Toggle Button */}
                    <li className="d-none d-sm-inline-block">
                        <div className="nav-link waves-effect waves-light" id="light-dark-mode">
                            <i className="ri-moon-line font-22" />
                        </div>
                    </li>
                    {/* User Dropdown */}
                    <li className="dropdown">
                        <a className="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                            <img src="assets/images/users/user-1.jpg" alt="user-image" className="rounded-circle" />
                            <span className="ms-1 d-none d-md-inline-block">
                                Geneva <i className="mdi mdi-chevron-down" />
                            </span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end profile-dropdown ">
                            {/* item*/}
                            <div className="dropdown-header noti-title">
                                <h6 className="text-overflow m-0">Welcome !</h6>
                            </div>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                <i className="fe-user" />
                                <span>My Account</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                <i className="fe-settings" />
                                <span>Settings</span>
                            </a>
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                <i className="fe-lock" />
                                <span>Lock Screen</span>
                            </a>
                            <div className="dropdown-divider" />
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                <i className="fe-log-out" />
                                <span>Logout</span>
                            </a>
                        </div>
                    </li>
                    {/* Right Bar offcanvas button (Theme Customization Panel) */}
                    <li>
                        <a className="nav-link waves-effect waves-light" data-bs-toggle="offcanvas" href="#theme-settings-offcanvas">
                            <i className="fe-settings font-22" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>

    )
}

export default SecondHeader
