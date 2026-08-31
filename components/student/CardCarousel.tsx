"use client";
import React, { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import CardImage from "./CardImage";
import { fetchCourses } from "@/features/courses/courses.api";
import type { Course } from "@/interfaces/Courses/Course";
import { PUBLIC_COURSE_IDS } from "@/utils/publicCourseIds";

const MAX_COURSES = 6;

const CardCarousel: React.FC = () => {
  const swiperRef = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    fetchCourses()
      .then((data) => {
        if (isCancelled) return;
        setCourses(
          data
            .filter((course) => course.is_active && PUBLIC_COURSE_IDS.includes(course.course_id))
            .slice(0, MAX_COURSES),
        );
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (courses.length === 0 || !swiperRef.current) return;

    new Swiper(swiperRef.current, {
      slidesPerView: 1, // Default to 1 slide per view
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1440: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
    });
  }, [courses]);

  if (isLoading) {
    return (
      <div className="text-white text-lg animate-pulse py-10">
        Cargando cursos...
      </div>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="swiper-container overflow-hidden" ref={swiperRef}>
      <div className="swiper-wrapper">
        {courses.map((course) => (
          <div className="swiper-slide" key={course.course_id}>
            <CardImage
              id={course.course_id}
              name={course.name}
              description_short={course.description_short}
              image={course.image}
              duration_course={course.duration_course}
              background="bg-white"
              buttonLabel="Ver detalles"
              textColor="text-black"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;
