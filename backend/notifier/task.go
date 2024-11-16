package notifier

import (
	"fmt"
	"time"

	"github.com/pocketbase/pocketbase/models"
)

// calculateDailyReminders processes a list of tasks and returns reminders
// for those that are due.
func (n *Notifier) calculateDailyReminders(emailAddress, userID string, userTasks []*models.Record) []TaskReminder {
	var reminders []TaskReminder

	for _, record := range userTasks {
		history := record.GetStringSlice("history")
		daysRepeat := record.GetInt("daysRepeat")
		daysRemind := record.GetInt("daysRemind")
		taskName := record.GetString("name")

		if len(history) == 0 || daysRepeat <= 0 {
			continue
		}

		lastDone, err := time.Parse("2006-01-02", history[0])
		if err != nil {
			n.pb.Logger().Error(
				"EMAIL reminder",
				"error", err.Error(),
				"email", emailAddress,
				"userId", userID,
			)
			continue
		}

		nextDue := lastDone.AddDate(0, 0, daysRepeat)
		today := time.Now()
		daysLate := int(today.Sub(nextDue).Hours() / 24)

		if (daysLate == 0 && daysRemind == 0) ||
			(daysLate >= 0 && daysRemind > 0 && daysLate%daysRemind == 0) {
			reminders = append(reminders, TaskReminder{taskName: taskName, daysLate: daysLate})
		}
	}

	return reminders
}

// formatReminderMessage creates a notification message for a task.
func (n *Notifier) formatReminderMessage(reminder TaskReminder) string {
	var reminderText string
	if reminder.daysLate == 0 {
		reminderText = fmt.Sprintf("%s (due today)", reminder.taskName)
	} else {
		reminderText = fmt.Sprintf("%s (%d days late)", reminder.taskName, reminder.daysLate)
	}
	return reminderText
}