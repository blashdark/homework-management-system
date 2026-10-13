# Customer Problem Analysis

## 1. Context

**Product:** Homework Management System  
**Domain:** Education  
**Primary goal:** Give lecturers and students one shared workflow for assigning, tracking, submitting, grading, and reviewing homework.

## 2. Stakeholders

| Stakeholder | Goals | Responsibilities |
| :--- | :--- | :--- |
| Lecturer | Distribute homework clearly, monitor progress, grade submissions, retain scores. | Create homework; set deadlines/reminders; manage classes/groups; assign homework; grade; provide feedback. |
| Student | Understand assigned work, avoid missed deadlines, submit work, view feedback and scores. | View homework/calendar; complete and submit homework; review grades and feedback. |

## 3. Operating Context

| Dimension | Current context |
| :--- | :--- |
| Learning mode | In-person classes, Zoom, Discord. |
| Homework type | Individual homework; group homework. |
| Communication | Homework instructions, reminders, submissions, feedback, and scores can be distributed across several channels. |

## 4. Current Business Workflow

1. Lecturer hands out homework.
2. Student completes exercise.
3. Student submits work.
4. Lecturer grades submission.
5. Lecturer hands over feedback/result.
6. System or lecturer saves score.

### Cost Drivers

| Cost | Impact |
| :--- | :--- |
| Time | Manual tracking, follow-up, searching across channels, and grading consume lecturer/student time. |
| Effort | Users must remember deadlines, locate instructions, coordinate groups, and maintain score records. |
| Opportunity cost | Time spent managing fragmented homework process reduces time available for teaching and learning. |

## 5. Problem Statement

Homework lifecycle is fragmented across in-person communication, Zoom, Discord, and manual records. Lecturers lack one consistent place to assign, track, and grade homework. Students can miss requirements or deadlines because homework information is not centralized and reminders are absent or inconsistent.

## 6. Pain Points

| Pain Point | Team Score | User Impact |
| :--- | :--- | :--- |
| Data Fragmentation | 4 | Homework instructions, submissions, feedback, and score records can exist in different channels. Users spend time locating current information. |
| Time consuming | 2 | Manual follow-up, coordination, tracking, and grading create avoidable administration effort. |
| Easy to forget | 1 | Students can miss homework or submit late when deadlines and reminders are unclear. |
| No privacy | 1 | Homework-related information may be exposed in shared communication spaces without suitable access boundaries. |

## 7. Prioritization

Team evaluated pain points with Eisenhower Matrix.

**Priority decision:** Address **Easy to forget** first.

### Rationale

- Missed deadlines directly affect submission completion and learning outcomes.
- Deadline, reminder, and calendar features provide clear, immediate mitigation.
- Solution gives students one visible source for upcoming homework.

![Eisenhower Matrix](../diagrams/exports/eisenhower-matrix.png)

## 8. Proposed Solution

Homework Management System centralizes homework lifecycle for lecturers and students.

| Capability | User Value | Pain Point Addressed |
| :--- | :--- | :--- |
| Create homework with deadline and reminder | Sets clear expectation; reduces missed or late work. | Easy to forget |
| Manage classes and groups | Creates reusable targets for individual/group homework. | Time consuming; Data Fragmentation |
| Assign homework to class/group | Delivers homework to correct student audience. | Data Fragmentation |
| Homework/deadline calendar | Makes upcoming work visible in one place. | Easy to forget; Data Fragmentation |
| Submit homework | Centralizes student submission. | Data Fragmentation |
| Grade homework and provide feedback | Centralizes evaluation and handover. | Data Fragmentation; Time consuming |

## 9. MVP Scope

### Lecturer

- Homework CRUD.
- Set deadline.
- Set reminder.
- Class/group CRUD.
- Assign homework to class/group.
- Grade homework and provide feedback.

### Student

- Submit homework.
- View homework calendar and deadlines.

### Shared

- View homework/deadline calendar.

## 10. Traceability

| Work Item | Scope |
| :--- | :--- |
| #93 | Analyze domain and stakeholders |
| #94 | Analyze homework business model |
| #95 | Validate pain points and evidence |
| #96 | Prioritize pain points with Eisenhower Matrix |
| #97 | Propose Homework Management System solution |
| #98 | Consolidate customer problem analysis |
| #99–#105 | Use case diagrams for MVP capabilities |

## 11. Next Steps

1. Complete use case diagrams by assigned owners.
2. Validate diagram boundaries, actors, and relationships against MVP scope.
3. Derive functional requirements and acceptance criteria from approved use cases.
