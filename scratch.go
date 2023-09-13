package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	fmt.Println("Hello, World!")
	reader, err := os.Open("data.txt")
	if err != nil {
		fmt.Println("Error opening file")
	}
	scanner := bufio.NewScanner(reader)
	scanner.Split(bufio.ScanLines)

	scanner.Scan()
	fmt.Println(scanner.Text())
	fmt.Println("End of first line")

	scanner.Scan()
	fmt.Println(scanner.Text())
	fmt.Println("End of second line")

	scanner.Scan()
	fmt.Println(scanner.Text())
	fmt.Println("End of third line")

	scanner.Scan()
	fmt.Println(scanner.Text())
	fmt.Println("End of fourth line")

	scanner.Scan()
	fmt.Println(scanner.Text())
	fmt.Println("End of fifth line")

	scanner.Scan()
	fmt.Println(scanner.Text())
	fmt.Println("End of sixth line")
}
