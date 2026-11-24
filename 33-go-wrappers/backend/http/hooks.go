package http

import "log"

// runHook runs the action it is given between the before and after hooks of an event.
func runHook(fn func() error, evt string) error {
	log.Printf("before_%s", evt)
	if err := fn(); err != nil {
		return err
	}
	log.Printf("after_%s", evt)
	return nil
}
