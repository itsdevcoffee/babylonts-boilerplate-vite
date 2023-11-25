export function generateOdds(count = 3) {
    if (count <= 0) {
        return []
    }

    const oddNumbers: number[] = []
    let currentNumber = 1

    while (oddNumbers.length < count) {
        oddNumbers.push(currentNumber)
        currentNumber += 2 // Move to the next odd number
    }

    return oddNumbers
}

export const getSqArr = (layers = 3) => {
    const aggArr: number[] = []
    const numArr: number[] = []
    const oddArr: number[] = []
    let lastOdd = 1

    while (oddArr.length < layers) {
        const lastNum = oddArr.length === 0 ? 0 : oddArr[oddArr.length - 1]
        oddArr.push(lastNum + lastOdd)
        lastOdd += 2
    }

    return oddArr
}
