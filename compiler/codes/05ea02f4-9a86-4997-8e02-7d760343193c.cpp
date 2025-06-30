#include <iostream>
using namespace std;

int main() {
    int rows = 5; // Change this to increase/decrease size

    for (int i = 1; i <= rows; ++i) {
        for (int j = 1; j <= i; ++j) {
            cout << "* ";
        }
        cout << endl;
    }

    return 0;
}
