# Requirements Document

## Introduction

The Fragrance Tracking System is a comprehensive web application that allows users to manage their fragrance collection, log usage experiences, and view statistics about their fragrance habits. The system supports both full bottles and decants, tracks detailed usage information, and provides insights through data visualization.

## Requirements

### Requirement 1

**User Story:** As a fragrance enthusiast, I want to add fragrances to my collection with detailed information, so that I can maintain a comprehensive database of my fragrances.

#### Acceptance Criteria

1. WHEN a user accesses the add fragrance page THEN the system SHALL display a form with fields for fragrance name, house, image URL, and detailed attributes
2. WHEN a user submits a valid fragrance form THEN the system SHALL save the fragrance with main accords, occasions, aromatic family, notes, gender distribution, and similar fragrances
3. WHEN a user adds a fragrance THEN the system SHALL create a user fragrance record with acquisition details including date, source, price, size, and batch code
4. WHEN a user specifies fragrance type THEN the system SHALL allow marking as either full bottle or decant
5. IF a fragrance with the same name and house already exists THEN the system SHALL prevent duplicate creation

### Requirement 2

**User Story:** As a user, I want to view and organize my fragrance collection, so that I can easily browse and manage my fragrances.

#### Acceptance Criteria

1. WHEN a user accesses the collection page THEN the system SHALL display all user fragrances separated into bottles and decants tabs
2. WHEN viewing the collection THEN the system SHALL show fragrance cards with image, name, house, and key details
3. WHEN a user wants to sort fragrances THEN the system SHALL provide sorting options by name, rating, and last used date
4. WHEN displaying collection counts THEN the system SHALL show separate counts for bottles and decants
5. WHEN a user clicks on a fragrance THEN the system SHALL navigate to the fragrance detail page

### Requirement 3

**User Story:** As a user, I want to log my fragrance usage experiences, so that I can track my preferences and usage patterns.

#### Acceptance Criteria

1. WHEN a user wants to create a log entry THEN the system SHALL display a modal form with comprehensive logging fields
2. WHEN creating a log THEN the system SHALL capture date, fragrance selection, enjoyment rating (1-10), number of sprays, and duration
3. WHEN logging usage THEN the system SHALL allow specifying use case, weather conditions, time of day, and whether tested on blotter
4. WHEN a user adds notes THEN the system SHALL store free-form text observations about the fragrance experience
5. WHEN a user submits a log THEN the system SHALL save the entry and update the logs display
6. IF a user marks a fragrance as gone THEN the system SHALL trigger the farewell process

### Requirement 4

**User Story:** As a user, I want to view my fragrance logs organized by date, so that I can review my usage history and experiences.

#### Acceptance Criteria

1. WHEN a user accesses the logs page THEN the system SHALL display logs grouped by date in reverse chronological order
2. WHEN viewing log groups THEN the system SHALL show the most recent group expanded by default
3. WHEN displaying individual logs THEN the system SHALL show fragrance name, enjoyment rating, sprays, duration, and notes
4. WHEN logs exist for a date THEN the system SHALL display them in a collapsible group format
5. WHEN no logs exist THEN the system SHALL display an appropriate empty state

### Requirement 5

**User Story:** As a user, I want to manage the lifecycle of my fragrances including when they're finished or sold, so that I can maintain accurate collection status.

#### Acceptance Criteria

1. WHEN a fragrance is marked as gone THEN the system SHALL display a farewell form
2. WHEN completing farewell THEN the system SHALL capture how the fragrance was disposed of (emptied, sold, gifted, lost, exchanged)
3. WHEN a fragrance is sold THEN the system SHALL record the sell price and recipient information
4. WHEN farewell is completed THEN the system SHALL update the fragrance status to "had" and record the gone date
5. WHEN viewing collection THEN the system SHALL distinguish between current ("have") and past ("had") fragrances

### Requirement 6

**User Story:** As a user, I want to view statistics about individual fragrances, so that I can understand my usage patterns and preferences.

#### Acceptance Criteria

1. WHEN a user accesses fragrance statistics THEN the system SHALL display usage analytics for that specific fragrance
2. WHEN viewing stats THEN the system SHALL show usage frequency, average enjoyment rating, and usage patterns
3. WHEN sufficient data exists THEN the system SHALL provide visual charts and graphs
4. WHEN displaying statistics THEN the system SHALL include temporal analysis of usage over time
5. WHEN no usage data exists THEN the system SHALL display an appropriate message

### Requirement 7

**User Story:** As a user, I want the system to be secure and personalized, so that my fragrance data is private and accessible only to me.

#### Acceptance Criteria

1. WHEN a user accesses the application THEN the system SHALL require authentication via Clerk
2. WHEN authenticated THEN the system SHALL only display data belonging to the current user
3. WHEN performing any data operation THEN the system SHALL validate user ownership
4. WHEN storing data THEN the system SHALL associate all records with the authenticated user ID
5. WHEN a user logs out THEN the system SHALL clear session data and redirect to login

### Requirement 8

**User Story:** As a user, I want the application to be responsive and performant, so that I can use it effectively on different devices.

#### Acceptance Criteria

1. WHEN accessing the application on mobile devices THEN the system SHALL display a responsive layout
2. WHEN loading pages THEN the system SHALL optimize performance using Next.js features
3. WHEN interacting with forms THEN the system SHALL provide real-time validation and feedback
4. WHEN displaying large datasets THEN the system SHALL implement efficient data loading strategies
5. WHEN using the application THEN the system SHALL maintain consistent UI/UX patterns using shadcn/ui components