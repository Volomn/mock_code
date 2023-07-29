package util

import (
	"net/http"

	"github.com/go-chi/render"
)

type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	ErrorMessage string `json:"msg,omitempty"` // application-level error message, for debugging
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

func ErrorBadRequest(err error, errorMessage *string) render.Renderer {
	var responseErrorMessage string
	if errorMessage == nil {
		responseErrorMessage = "Bad request"
	} else {
		responseErrorMessage = *errorMessage
	}
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 400,
		ErrorMessage:   responseErrorMessage,
	}
}

func ErrorNotFound(err error, errorMessage *string) render.Renderer {
	var responseErrorMessage string
	if errorMessage == nil {
		responseErrorMessage = "Not found"
	} else {
		responseErrorMessage = *errorMessage
	}
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 404,
		ErrorMessage:   responseErrorMessage,
	}
}

func ErrorUnprocessableContent(err error, errorMessage *string) render.Renderer {
	var responseErrorMessage string
	if errorMessage == nil {
		responseErrorMessage = "invalid request"
	} else {
		responseErrorMessage = *errorMessage
	}
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 422,
		ErrorMessage:   responseErrorMessage,
	}
}
