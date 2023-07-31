package judge

import (
	"fmt"
	"io"
	"reflect"
)

type JudgeMethoNotDefinedError struct {
	Msg string
}

func (err *JudgeMethoNotDefinedError) Error() string {
	return err.Msg
}

func NewJudgeMethodNotDefinedError(msg string) *JudgeMethoNotDefinedError {
	return &JudgeMethoNotDefinedError{Msg: msg}
}

type Judge struct {
}

func (judge *Judge) Call(JudgeName string, inputFile io.Reader, outputFile io.Reader) (float32, error) {
	JudgeMethod := reflect.ValueOf(judge).MethodByName(JudgeName)
	if JudgeMethod.IsValid() == false {
		errorMessage := fmt.Sprintf("Judge method %s not defined", JudgeName)
		return 0, NewJudgeMethodNotDefinedError(errorMessage)
	}
	// in := make([]reflect.Value, 2)
	in := []reflect.Value{reflect.ValueOf(inputFile), reflect.ValueOf(outputFile)}
	res := JudgeMethod.Call(in)
	score := res[0].Interface().(float32)
	err := res[1].Interface().(error)
	return score, err
}
