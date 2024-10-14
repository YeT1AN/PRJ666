import {
  RiAddLine,
  RiSubtractLine,
  RiLogoutCircleLine,
  RiCircleLine,
  RiDashboardFill,
  RiBookOpenFill,
  RiGraduationCapFill,
  RiUserAddFill,
  RiCalendarFill,
  RiDraftFill,
  RiArchiveDrawerFill,
  RiUser3Fill,
  RiSearchLine,
  RiCloseLine,
  RiArrowRightCircleLine,
  RiCheckboxCircleFill,
} from "@remixicon/react";

const icons = {
  CheckboxCircleIcon: (className = "", style = {}) => (
    <RiCheckboxCircleFill className={className} style={style} />
  ),
  PlusIcon: (className = "", style = {}) => (
    <RiAddLine className={className} style={style} />
  ),
  MinusIcon: (className = "", style = {}) => (
    <RiSubtractLine className={className} style={style} />
  ),
  CircleIcon: (className = "", style = {}) => (
    <RiCircleLine className={className} style={style} />
  ),
  DashboardIcon: (className = "", style = {}) => (
    <RiDashboardFill className={className} style={style} />
  ),
  UserIcon: (className = "", style = {}) => (
    <RiUserAddFill className={className} style={style} />
  ),
  MyCoursesIcon: (className = "", style = {}) => (
    <RiCalendarFill className={className} style={style} />
  ),
  StudentIcon: (className = "", style = {}) => (
    <RiGraduationCapFill className={className} style={style} />
  ),
  CourseIcon: (className = "", style = {}) => (
    <RiBookOpenFill className={className} style={style} />
  ),
  ProgramIcon: (className = "", style = {}) => (
    <RiArchiveDrawerFill className={className} style={style} />
  ),
  TeacherIcon: (className = "", style = {}) => (
    <RiUser3Fill className={className} style={style} />
  ),
  EnrollmentIcon: (className = "", style = {}) => (
    <RiDraftFill className={className} style={style} />
  ),
  LogoutIcon: <RiLogoutCircleLine />,
  SearchIcon: <RiSearchLine />,
  CloseIcon: <RiCloseLine />,
  ArrowRightIcon: (className = "", style = {}) => (
    <RiArrowRightCircleLine className={className} style={style} />
  ),
};

export default icons;