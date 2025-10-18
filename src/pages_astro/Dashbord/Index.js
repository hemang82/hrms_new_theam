

import React, { useEffect, useRef, useState } from 'react'
import * as API from '../../utils/api.services';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { Codes, PUBLIC_URL } from '../../config/constant';
import { PATHS } from '../../Router/PATHS';
import SubNavbar from '../../layout/SubNavbar';
import OwlCarousel from 'react-owl-carousel';


const Index = () => {

    const [dashboard, setDashboard] = useState({});
    const { birthdayAndAnnivarsary: { data: birthdayList }, } = useSelector((state) => state.masterslice);


    const [options, setOptions] = useState({
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 1500,  // ⏱️ wait 2.5s before next slide
        autoplaySpeed: 1000,    // smooth transition speed
        autoplayHoverPause: true,
        dots: true,             // show bottom dots
        nav: false,
        smartSpeed: 1000,
        responsive: {
            0: { items: 1 },
            576: { items: 1 },
            992: { items: 1 },
        },
    });

    const fetchDashboardData = async () => {
        try {
            const res = await API.DashboardCount({});
            if (res?.code == Codes.SUCCESS) {
                setDashboard(res?.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const dashboardCards = [
        {
            title: "Total Employee",
            icon: "/dist/images/svgs/tabler-icon-users.svg",
            value: dashboard?.total_employee_count,
            link: PATHS?.EMPLOYEE_LIST
        },
        {
            title: "Total Present",
            icon: "/dist/images/svgs/tabler-icon-users.svg",
            value: dashboard?.present_count,
            link: PATHS?.ATTENDANCE_LIST
        },
        {
            title: "Total Absent",
            icon: "/dist/images/svgs/tabler-icon-users.svg",
            value: dashboard?.absent_count,
            link: PATHS?.ATTENDANCE_LIST
        },
        // {
        //     title: "Total Reject Loan",
        //     icon: "/dist/images/svgs/iconimg.svg",
        //     value: dashboard?.REJECTED,
        //     link: "/loan_list"
        // },
    ];

    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        let animationFrameId;
        const COLORS = [
            [255, 99, 132],
            [54, 162, 235],
            [255, 206, 86],
            [75, 192, 192],
            [153, 102, 255],
            [255, 159, 64],
        ];
        const PI_2 = 2 * Math.PI;
        const NUM_CONFETTI = 80;
        let confetti = [];
        let w = 0;
        let h = 0;
        let xpos = 0.5;

        const resizeCanvas = () => {
            const rect = canvas.parentNode.getBoundingClientRect();
            w = canvas.width = rect.width;
            h = canvas.height = rect.height;
        };

        class Confetti {
            constructor() {
                this.style = COLORS[~~(Math.random() * COLORS.length)];
                this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
                this.r = ~~(Math.random() * 6) + 2;
                this.replace();
            }
            replace() {
                this.opacity = 0;
                this.dop = 0.01 * (Math.random() * 3 + 1);
                this.x = Math.random() * w;
                this.y = Math.random() * h - h;
                this.xmax = w - this.r;
                this.ymax = h - this.r;
                this.vx = (Math.random() - 0.5) * 0.8;  // reduce horizontal speed too
                this.vy = 0.2 * this.r + Math.random() * 0.2; // much slower fall
            }
            draw() {
                this.x += this.vx;
                this.y += this.vy;
                this.opacity += this.dop;
                if (this.opacity > 1) {
                    this.opacity = 1;
                    this.dop *= -1;
                }
                if (this.opacity < 0 || this.y > this.ymax) this.replace();
                if (this.x < 0 || this.x > this.xmax)
                    this.x = (this.x + this.xmax) % this.xmax;
                context.beginPath();
                context.arc(this.x, this.y, this.r, 0, PI_2, false);
                context.fillStyle = `${this.rgb},${this.opacity})`;
                context.fill();
            }
        }

        const initConfetti = () => {
            confetti = Array.from({ length: NUM_CONFETTI }, () => new Confetti());
        };

        const animate = () => {
            context.clearRect(0, 0, w, h);
            confetti.forEach((c) => c.draw());
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initConfetti();
        animate();

        window.addEventListener("resize", resizeCanvas);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [birthdayList]);

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar />
                <div className="row">
                    {dashboardCards?.map((card, index) => (
                        <div className="col-12 col-sm-6 col-md-2 col-lg-3 " key={index}>
                            <div className="card border-1 zoom-in them-light shadow-sm">
                                <div className="card-body text-center">
                                    <Link to={card.link}>
                                        <img src={PUBLIC_URL + card.icon} width={35} height={35} className="mb-3" alt="Icon" />
                                        <p className="fw-semibold fs-5 text-dark mb-1">{card.title}</p>
                                        <h4 className="fw-semibold  text-dark mb-0">
                                            <CountUp start={0} end={card?.value || 0} duration={3} separator="," />
                                        </h4>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row mt-3 mb-3 p-3">
                    {
                        birthdayList?.length > 0 &&
                        <div className="col-12 col-sm-6 col-lg-6 col-md-12 border border-2 rounded-3  shadow-sm">
                            <OwlCarousel
                                key={birthdayList?.length} // ✅ re-renders when data count changes
                                className="owl-theme"
                                {...options}
                            >
                                {birthdayList?.map((data, index) => (
                                    <div key={index} className="col-12">
                                        <div className="card position-relative rounded-4 mx-auto my-4 shadow-md border-1"
                                            style={{
                                                maxWidth: "22rem",
                                                background: "rgba(255, 255, 255, 0.6)",
                                                backdropFilter: "blur(10px)",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <canvas className="position-absolute top-0 start-0 w-100 h-100" ref={canvasRef} style={{ zIndex: 0 }} />

                                            <div className="d-flex justify-content-center mt-4 position-relative" style={{ zIndex: 2 }} >
                                                <div className="bg-white rounded-circle p-1 ">
                                                    <img
                                                        src={"/dist/images/logos/hrms_icon.png"}
                                                        alt="profile"
                                                        className="rounded-circle border border-3 border-white shadow"
                                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="card-body text-center position-relative" style={{ zIndex: 2 }}>
                                                <h5
                                                    className="fw-semibold fs-5 text-custom-theam"
                                                    style={{
                                                        // background: "linear-gradient(90deg, #ff4b2b, #ff416c, #ff6a00)",
                                                        // WebkitBackgroundClip: "text",
                                                        // WebkitTextFillColor: "transparent",
                                                    }}
                                                >
                                                    {data?.name}
                                                </h5>

                                                <p className="text-muted small  fw-semibold">{data?.date}</p>

                                                <p className="fw-semibold fs-6 text-custom-theam text-nowrap ">
                                                    {data?.type == "Anniversary"
                                                        ? "🌟Happy Work Anniversary!🌟"
                                                        : "🎉 Happy Birthday! 🎂"}
                                                </p>

                                                <p className="text-secondary mt-2 lh-base">
                                                    {data?.type == "Anniversary"
                                                        ? "Thank you for your amazing contributions! Wishing you continued success and growth with us."
                                                        : "🎉 Wishing you joy, success, and happiness on your special day.💐"}
                                                </p>

                                                <div className="text-center mb-2 position-relative" style={{ zIndex: 2 }}>
                                                    {data?.type === "Anniversary" ? (
                                                        <span className="fs-4 floating">🎊🥳🏆</span>
                                                    ) : (
                                                        <span className="fs-4 floating">🎈🎉🎂🎊</span>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </OwlCarousel>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default Index;
