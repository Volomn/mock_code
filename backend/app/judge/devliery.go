package judge

import (
	"bufio"
	"fmt"
	"io"
	"math"
	"regexp"
	"strconv"
	"strings"
)

func Distance(x1, y1, x2, y2 int) int {
	res := math.Pow(math.Abs(float64(x2-x1)), 2.0)
	res = res + math.Pow(math.Abs(float64(y2-y1)), 2.0)
	res = math.Sqrt(res)
	return int(math.Ceil(res))
}

type Order struct {
	Index            int
	X                int
	Y                int
	NumberOfProducts int
	ProductTypes     []int
}

func (order *Order) isComplete() bool {
	return len(order.ProductTypes) == 0
}

func NewOrder(index int, x int, y int, numberOfProducts int, productTypes []int) (*Order, error) {
	if len(productTypes) != numberOfProducts {
		return nil, fmt.Errorf("Number of product types does not match number of products")
	}
	return &Order{
		Index:            index,
		X:                x,
		Y:                y,
		NumberOfProducts: numberOfProducts,
		ProductTypes:     productTypes,
	}, nil
}

type Product struct {
	Type   int
	Weight int
}

type Warehouse struct {
	Index    int
	X        int
	Y        int
	Products []int
}

func (warehouse *Warehouse) IsProductAvailable(product Product, num int) bool {
	return warehouse.Products[product.Type] >= num
}

type Drone struct {
	Index          int
	X              int
	Y              int
	MaximumPayload int
	Carrying       []Product
	Turns          int
}

func (drone *Drone) Load(warehouse *Warehouse, product Product, number int) (*Drone, error) {
	drone.Turns += Distance(drone.X, drone.Y, warehouse.X, warehouse.Y)
	drone.X = warehouse.X
	drone.Y = warehouse.Y

	if !warehouse.IsProductAvailable(product, number) {
		return drone, fmt.Errorf("Warehouse %d does not have %d %d", warehouse.Index, number, product.Type)
	}

	totalWeight := number * product.Weight
	if totalWeight > drone.MaximumPayload {
		return drone, fmt.Errorf("Drone %d cannot carry %d %d", drone.Index, number, product.Type)
	}

	for i := 0; i < number; i++ {
		drone.Carrying = append(drone.Carrying, product)
		warehouse.Products[product.Type]--
		drone.MaximumPayload -= product.Weight
	}

	drone.Turns += 1
	return drone, nil
}

func (drone *Drone) CountProductTypes(productTypes []int, target int) int {
	count := 0
	for _, productType := range productTypes {
		if productType == target {
			count++
		}
	}
	return count
}

func (drone *Drone) CountProduct(products []Product, target Product) int {
	count := 0
	for _, product := range products {
		if product.Type == target.Type {
			count++
		}
	}
	return count
}

func (drone *Drone) findProductIndex(products []Product, target Product) int {
	for i, product := range products {
		if product.Type == target.Type && product.Weight == target.Weight {
			return i
		}
	}
	return -1
}

func (drone *Drone) findProductTypeIndex(productTypes []int, target int) int {
	for i, productType := range productTypes {
		if productType == target {
			return i
		}
	}
	return -1
}

func (drone *Drone) Deliver(order *Order, product Product, number int) (*Drone, error) {
	drone.Turns += Distance(drone.X, drone.Y, order.X, order.Y)
	drone.X = order.X
	drone.Y = order.Y

	if len(drone.Carrying) <= 0 {
		return drone, fmt.Errorf("Drone %d is not carrying %d %d", drone.Index, number, product.Type)
	}

	if drone.CountProductTypes(order.ProductTypes, product.Type) <= 0 {
		return drone, fmt.Errorf("Drone %d is trying to deliver an unordered product to order %d", drone.Index, order.Index)
	}

	if drone.CountProductTypes(order.ProductTypes, product.Type) < number {
		return drone, fmt.Errorf("Drone %d is delivering more than ordered to order %d", drone.Index, order.Index)
	}

	if drone.CountProduct(drone.Carrying, product) < number {
		return drone, fmt.Errorf("Drone %d is trying to deliver more product of type %d than it is carrying", drone.Index, product.Type)
	}

	for i := 0; i < number; i++ {
		carryingProductIndex := drone.findProductIndex(drone.Carrying, product)
		drone.Carrying = append(drone.Carrying[:carryingProductIndex], drone.Carrying[carryingProductIndex+1:]...)
		drone.MaximumPayload += product.Weight
		orderProductTypeIndex := drone.findProductTypeIndex(order.ProductTypes, product.Type)
		order.ProductTypes = append(order.ProductTypes[:orderProductTypeIndex], order.ProductTypes[orderProductTypeIndex+1:]...)
		order.NumberOfProducts -= 1
	}
	drone.Turns += 1
	return drone, nil
}

type Grid struct {
	Rows        int
	Cols        int
	Turns       int
	Drones      []*Drone
	Warehourses []*Warehouse
	Orders      []*Order
	Products    []*Product
	Scores      []int
}

func (grid *Grid) GetProduct(productType int) *Product {
	for _, product := range grid.Products {
		if product.Type == productType {
			return product
		}
	}
	return nil
}

func (grid *Grid) CalculateScore() int {
	totalScore := float32(0)
	for _, score := range grid.Scores {
		score += score
	}
	return int(totalScore)
}

func (grid *Grid) GetNumberOfCompletedOrders() int {
	count := 0
	for _, order := range grid.Orders {
		if order.isComplete() {
			count++
		}
	}
	return count
}

func (grid *Grid) ProcessCommand(command string) (*Drone, error) {
	re := regexp.MustCompile(`^(\d+)\s([LD])\s(\d+)\s(\d+)\s(\d+)$`)
	match := re.FindStringSubmatch(command)
	if match == nil {
		return nil, fmt.Errorf("Command %s is invalid", command)
	}
	droneIndex, _ := strconv.Atoi(match[0])
	droneCommand := match[1]
	warehouseOrderIndex, _ := strconv.Atoi(match[2])
	productType, _ := strconv.Atoi(match[3])
	numberOfProducts, _ := strconv.Atoi(match[4])

	switch droneCommand {
	case "L":
		return grid.Drones[droneIndex].Load(grid.Warehourses[warehouseOrderIndex], *grid.GetProduct(productType), numberOfProducts)
	case "D":
		return grid.Drones[droneIndex].Deliver(grid.Orders[warehouseOrderIndex], *grid.GetProduct(productType), numberOfProducts)
	default:
		return nil, fmt.Errorf("Command %s is invalid", command)
	}

}

func (grid *Grid) Simulate(solution io.Reader) (*Grid, error) {
	numberOfCompletedOrders := 0
	tmpNumberOfCompletedOrders := 0

	scanner := bufio.NewScanner(solution)
	scanner.Split(bufio.ScanLines)

	scanner.Scan()
	totalNumberOfCommands, err := strconv.Atoi(scanner.Text())
	if err != nil {
		return nil, fmt.Errorf("Invalid solution file")
	}

	for i := 0; i < totalNumberOfCommands; i++ {
		scanner.Scan()
		command := scanner.Text()
		drone, err := grid.ProcessCommand(command)
		if err != nil {
			return nil, err
		}
		if drone.Turns > grid.Turns-1 {
			return nil, fmt.Errorf("Drone %d has exceeded it's maximum number of turns", drone.Index)
		}
		tmpNumberOfCompletedOrders = grid.GetNumberOfCompletedOrders()
		// Check if any new orders have been completed
		if tmpNumberOfCompletedOrders > numberOfCompletedOrders {
			score := float64((grid.Turns-drone.Turns)/grid.Turns) * 100
			grid.Scores = append(grid.Scores, int(math.Ceil(score)))
			numberOfCompletedOrders = tmpNumberOfCompletedOrders
		}
	}
	return grid, nil
}

func GridFromInputFile(input io.Reader) (*Grid, error) {
	scanner := bufio.NewScanner(input)
	scanner.Split(bufio.ScanLines)

	var products []*Product
	var warehouses []*Warehouse
	var orders []*Order
	var drones []*Drone

	scanner.Scan()
	gridLine := strings.Split(scanner.Text(), " ")
	numberOfRows, _ := strconv.Atoi(gridLine[0])
	numberOfColumns, _ := strconv.Atoi(gridLine[1])
	numberOfDrones, _ := strconv.Atoi(gridLine[2])
	totalNumberOfTurns, _ := strconv.Atoi(gridLine[3])
	dronePayload, _ := strconv.Atoi(gridLine[4])

	scanner.Scan()
	productTypes, _ := strconv.Atoi(strings.Trim(scanner.Text(), " "))

	scanner.Scan()
	productWeights := strings.Split(strings.Trim(scanner.Text(), " "), " ")
	for i := 0; i < productTypes; i++ {
		productWeight, _ := strconv.Atoi(productWeights[i])
		product := &Product{Type: i, Weight: productWeight}
		products = append(products, product)
	}

	scanner.Scan()
	numberOfWarehouses, _ := strconv.Atoi(strings.Trim(scanner.Text(), " "))
	for i := 0; i < numberOfWarehouses; i++ {
		scanner.Scan()
		warehouseLocationLine := strings.Split(strings.Trim(scanner.Text(), " "), " ")
		warehouseProductsLine := strings.Split(strings.Trim(scanner.Text(), " "), " ")
		warehouseX, _ := strconv.Atoi(warehouseLocationLine[0])
		warehouseY, _ := strconv.Atoi(warehouseLocationLine[1])
		warehouseProducts := make([]int, len(warehouseProductsLine))
		for productsIndex, warehouseProduct := range warehouseProductsLine {
			warehouseProducts[productsIndex], _ = strconv.Atoi(warehouseProduct)
		}
		warehouse := &Warehouse{Index: i, X: warehouseX, Y: warehouseY, Products: warehouseProducts}
		warehouses = append(warehouses, warehouse)
	}

	scanner.Scan()
	numberOfOrders, _ := strconv.Atoi(strings.Trim(scanner.Text(), " "))
	for i := 0; i < numberOfOrders; i++ {
		scanner.Scan()
		orderLocationLine := strings.Split(strings.Trim(scanner.Text(), " "), " ")
		scanner.Scan()
		numberOfOrderProducts, _ := strconv.Atoi(strings.Trim(scanner.Text(), " "))
		scanner.Scan()
		orderProductsLine := strings.Split(strings.Trim(scanner.Text(), " "), " ")

		orderX, _ := strconv.Atoi(orderLocationLine[0])
		orderY, _ := strconv.Atoi(orderLocationLine[1])
		orderProducts := make([]int, len(orderProductsLine))
		for productsIndex, orderProduct := range orderProductsLine {
			orderProducts[productsIndex], _ = strconv.Atoi(orderProduct)
		}
		order := &Order{Index: i, X: orderX, Y: orderY, NumberOfProducts: numberOfOrderProducts, ProductTypes: orderProducts}
		orders = append(orders, order)
	}

	for i := 0; i < numberOfDrones; i++ {
		drone := &Drone{Index: i, X: warehouses[0].X, Y: warehouses[0].Y, MaximumPayload: dronePayload, Turns: -1}
		drones = append(drones, drone)
	}

	return &Grid{Warehourses: warehouses, Drones: drones, Orders: orders, Products: products, Rows: numberOfRows, Cols: numberOfColumns, Turns: totalNumberOfTurns}, nil
}

func (judge *Judge) Delivery(solution io.Reader, input io.Reader) (int, error) {
	grid, error := GridFromInputFile(input)
	if error != nil {
		return 0, error
	}
	grid, error = grid.Simulate(solution)
	if error != nil {
		return 0, error
	}
	return grid.CalculateScore(), nil
}
