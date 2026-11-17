# Stoneman Ops — Routes

## Frontend pages (React)

### Public
| Path | Page |
| --- | --- |
| `/login` | Sign in (email + password). "Forgot password?" explains that the admin resets it. |
| `/register` | Employee registration with passport photo; signs the employee in immediately |

### Employee (role `employee`)
| Path | Page |
| --- | --- |
| `/dashboard` | Date and holiday banner, add today's tasks, one-click status, enquiry box, day-wise history |
| `/profile` | ID-card profile and change password |

### Admin (role `admin`)
| Path | Page |
| --- | --- |
| `/admin` | Redirects to `/admin/reports` |
| `/admin/reports` | Analytics overview: KPIs, charts, top performers, open enquiries, CSV export |
| `/admin/employees` | All employees: card/list view and search |
| `/admin/employees/:id` | Employee detail split screen: profile, KPIs, filters, charts, day-wise feed, reset password, activate/deactivate |
| `/admin/holidays` | Manage holidays |
| `/profile` | Admin's own profile and change password |

`/` sends signed-in users to their home (`/dashboard` or `/admin/reports`) and everyone else to `/login`. Employees opening an `/admin/*` page are redirected to `/dashboard`, and admins opening `/dashboard` are redirected to `/admin/reports`.

## Backend API (Express, base URL `/api`)

Send the token as `Authorization: Bearer <token>` on every non-public route.

### Public
| Method | Endpoint | Body |
| --- | --- | --- |
| GET | `/api/health` | — |
| GET | `/api/meta` | — (designations, genders, task statuses) |
| POST | `/api/auth/register` | `multipart/form-data`: firstName, lastName, email, mobile, designation, dob (YYYY-MM-DD), gender, password, confirmPassword, **photo** (jpg/jpeg/png/webp, max 5 MB) → `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }` |

### User routes (any signed-in user; employees see only their own data)
| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/auth/password` | `{ currentPassword, newPassword, confirmPassword }` → new `{ token, user }`; signs out other sessions |
| GET | `/api/tasks?from=&to=&status=` | Own tasks (defaults to today) |
| POST | `/api/tasks` | `{ title, description?, status? }` — filed under today |
| PATCH | `/api/tasks/:id` | `{ title?, description?, status? }` |
| DELETE | `/api/tasks/:id` | Only today's tasks |
| GET | `/api/tasks/activity?from=&to=&status=&hasEnquiry=` | Own day-wise feed and chart data |
| GET | `/api/enquiries?from=&to=` | Own enquiries |
| POST | `/api/enquiries` | `{ message }` |
| GET | `/api/holidays/today` | Date, `isSunday`, today's holiday, upcoming holidays |
| GET | `/api/holidays` | All holidays |

### Admin routes (role `admin` only — others get 403)
| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/admin/employees?search=` | Name/designation/email search, with task stats |
| GET | `/api/admin/employees/:id` | Profile and KPI summary |
| GET | `/api/admin/employees/:id/activity?from=&to=&status=&hasEnquiry=` | Day-wise feed and analytics |
| PATCH | `/api/admin/employees/:id/status` | `{ isActive: true \| false }` |
| PATCH | `/api/admin/employees/:id/password` | `{ password, confirmPassword }` — temporary password for a forgotten one |
| PATCH | `/api/admin/enquiries/:id` | `{ status: "open" \| "resolved" }` |
| GET | `/api/admin/reports?from=&to=` | Company KPIs and chart data |
| GET | `/api/admin/reports/export?from=&to=` | CSV download |
| POST | `/api/holidays` | `{ name, date, type: national\|festival\|company, recurring?, description? }` |
| PUT | `/api/holidays/:id` | Same body as POST |
| DELETE | `/api/holidays/:id` | — |

Dates are `YYYY-MM-DD` in India time (`APP_TIMEZONE`, default `Asia/Kolkata`). Date ranges default to the last 30 days (14 for the employee feed) and are capped at 366 days.
