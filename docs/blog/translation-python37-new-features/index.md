# Python 3.7의 새로운 기능들

> [Cool New Features in Python 3.7](https://realpython.com/python37-new-features/)을 번역한 글입니다.

---

[[toc]]

---

Python 3.7이 [공식적으로 릴리스](https://www.python.org/downloads/release/python-370/) 되었습니다. 이 버전은 [2016년 9월](https://www.python.org/dev/peps/pep-0537/)부터 개발되어 왔으며 핵심 개발자들의 노력으로 드디어 사용할 수 있게 되었습니다.

새로운 버전에선 어떤것들이 바뀌었을까요? [Python 3.7 문서](https://docs.python.org/3.7/whatsnew/3.7.html)에서 새로운 기능들을 살펴볼 수도 있지만, 이 포스트에서는 주목할만한 변경점들에 대해서 좀 더 자세히 다뤄보고자 합니다.

이 포스트에서 다룰 내용은 다음과 같습니다.

- 새로운 breakpoint() 내장 함수를 통한 좀 더 수월한 디버깅
- 데이터 클래스 (dataclass)를 사용한 간편한 클래스 생성
- 모듈 속성 접근 커스터마이징
- 향상된 타입 힌팅 지원
- 고정밀 시간 함수

더 중요한건 Python3.7은 빠르다는 것입니다.

Python 3.7의 속도에 대해서도 마지막 섹션에서 살펴볼 것입니다. 새로운 버전으로의 업그레이드에 대한 여러 조언을 얻을 수 있을 것입니다.

## breakpoint() 내장 함수 지원

개발자들은 완벽한 코드를 작성하려고 노력하지만, 진실은 결코 완벽한 코드를 작성할수는 없다는 것입니다. 디버깅은 프로그래밍의 중요한 부분입니다. Python 3.7에는 breakpoint()라는 새로운 내장 함수가 들어왔습니다. 이 함수는 Python에 새로운 기능을 제공하지는 않지만 디버거를 좀 더 유연하고 직관적으로 사용할 수 있게 해줍니다.

여러분이 `bugs.py` 파일에 다음과 같은 버그를 유발하는 코드를 작성했다고 가정해봅시다.

```python
def divide(e, f):
    return f / e

a, b = 0, 1
print(divide(a, b))
```

코드를 실행하면 `divide()` 함수에서 `ZeroDivisionError` 익셉션이 발생할 것입니다. 여러분은 디버깅을 위해  `divide()` 최상단에 [디버거](https://realpython.com/python-debugging-pdb/)를 위치시켜 코드를 인터럽트하고 싶을겁니다. 코드에 소위 "중단점 (breakpoint)"이라고 하는걸 설정하면 코드를 인터럽트 할 수 있습니다.

```python
def divide(e, f):
    # 중단점 삽입 지점
    return f / e
```

중단점은 프로그램의 현재 상태를 확인할 수 있도록 실행을 일시적으로 중단해야하는 코드 내의 신호입니다. 중단점은 어떻게 설정할 수 있을까요? Python 3.6 이하에서는 다음과 같이 설정할 수 있습니다.

```python
def divide(e, f):
    import pdb; pdb.set_trace()
    return f / e
```

[pdb](https://docs.python.org/library/pdb.html)는 표준 라이브러리의 Python 디버거입니다. Python 3.7에서는 새로운 `breakpoint()` 함수를 호출함으로써 위 명령문을 단축할 수 있습니다.

```python
def divide(e, f):
    breakpoint()
    return f / e
```

백그라운드에서, `breakpoint()`는 먼저 `pdb`를 임포트한 뒤 `pub.set_trace()`를 호출합니다. 가시적인 이점은 `breakpoint()`가 `import pdb; pdb.set_trace()`보다  더 기억하기 쉬우며 27자 대신 12자만 작성하면 된다는 것입니다. 하지만, `breakpoint()`을 사용함으로써 얻을 수 있는 실질적인 이점은 커스터마이징 기능입니다.

`breakpoint()`가 작성된 `bugs.py` 스크립트를 실행해봅시다.

```
$ python3.7 bugs.py 
> /home/gahjelle/bugs.py(3)divide()
-> return f / e
(Pdb)
```

스크립트는 `breakpoint()`를 만나면 실행이 중단되고 PDB 디버깅 세션에 진입할 것입니다. `c`를 입력하고 엔터를 누르면 스크립트를 계속 진행할 수 있습니다. PDB와 디버깅에 대해 좀 더 자세히 알고싶다면 `Nathan Jennings의 PDB 가이드`를 참고하세요.

이제 여러분이 버그를 고쳤다고 생각한다고 해봅시다. 그럼 이제 여러분은 디버거에서의 중단 없이 코드를 실행하고 싶을겁니다. 그냥 `breakpoint()` 라인을 주석처리 해버려도 되지만 `PYTHONBREAKPOINT` 환경 변수를 사용할 수도 있습니다. 이 변수는 `breakpoint()`의 동작을 제어하는데 `PYTHONBREAKPOINT=0`으로 설정하면 모든 `breakpoint()` 호출이 무시됩니다.

```
$ PYTHONBREAKPOINT=0 python3.7 bugs.py
ZeroDivisionError: division by zero
```

버그가 안고쳐진 것 같습니다 ..

또 다른 옵션은 `PYTHONBREAKPOINT`를 사용해 PDB 외의 디버거를 지정하는 것입니다. 예를 들어, [PuDB ()](https://pypi.org/project/pudb/)를 사용하려면 다음과 같이 설정하면 됩니다.

```
$ PYTHONBREAKPOINT=pudb.set_trace python3.7 bugs.py
```

위 명령어가 동작하려면 `pudb`가 이미 설치되어 있어야합니다. Python이 알아서 `pudb`를 임포트합니다. 이 방법으로 기본 디버거를 설정할 수 있는데 `PYTHONBREAKPOINT` 환경 변수를 원하는 디버거로 설정해두면 됩니다. 여러분의 시스템에 맞는 환경 변수를 설정하는 방법은 [이 가이드](https://www.schrodinger.com/kb/1842)를 참고하세요.

새로운 `breakpoint()` 함수는 디버거에서만 동작하지는 않습니다. 한 가지 편리한 옵션은 코드 내에서 대화형 셸을 시작하는 것입니다. 예를 들어, IPython 세션을 시작하려면 다음과 같이 설정하면 됩니다.

```
$ PYTHONBREAKPOINT=IPython.embed python3.7 bugs.py 
IPython 6.3.1 -- An enhanced Interactive Python. Type '?' for help.

In [1]: print(e / f)
0.0
```

또한 자체 함수를 만들어 `breakpoint()`에서 호출되도록 할수도 있습니다. 다음 코드는 지역 스코프의 모든 변수들을 출력합니다. 이 코드를 `bp_utils.py` 파일에 추가해봅시다.

```python
from pprint import pprint
import sys

def print_locals():
    caller = sys._getframe(1)  # 호출자 (Caller)는 한 프레임 위에 있습니다.
    pprint(caller.f_locals)
```

이 함수를 사용하려면 `<module>.<function>` 표기법을 사용해 `PYTHONBREAKPOINT`를 이전과 같이 설정하면 됩니다.

```
$ PYTHONBREAKPOINT=bp_utils.print_locals python3.7 bugs.py 
{'e': 0, 'f': 1}
ZeroDivisionError: division by zero
```

일반적으로 `breakpoint()`는 인자가 필요없는 함수와 메서드를 호출하는데 사용되지만, 인자를 전달할 수도 있습니다. `bugs.py`의 `breakpoint()`를 다음과 같이 수정해봅시다.

```python
breakpoint(e, f, end="<-END\n")
```

::: tip

**Note:** `pdb.set_trace()`는 위치 인자를 받지 않기 때문에 기본 PDB 디버거는 위 라인에서 `TypeError`를 발생시킵니다.

:::

`print()` 함수로 가장한 `breakpoint()`를 사용해 이 코드를 실행하면 인자가 전달되는 간단한 예시를 볼 수 있습니다.

```
$ PYTHONBREAKPOINT=print python3.7 bugs.py 
0 1<-END
ZeroDivisionError: division by zero
```

이 함수에 대한 자세한 내용은 [PEP 553](https://www.python.org/dev/peps/pep-0553/)과 [breakpoint()](https://docs.python.org/3.7/library/functions.html#breakpoint) 및 [sys.breakpointhook()](https://docs.python.org/3.7/library/sys.html#sys.breakpointhook) 문서를 참고하세요.

## 데이터 클래스 (dataclass)

새로운 [데이터 클래스 (dataclasses)](https://docs.python.org/3.7/library/dataclasses.html) 모듈은 `.__init__()` , `.__repr()__.` 및 `.__eq__()`와 같은 특수 메서드를 자동으로 추가함으로써 클래스를 보다 더 편리하게 작성할 수 있도록 해줍니다. `@dataclass` 데코레이터를 사용해 다음과 같이 작성할 수 있습니다.

```python
from dataclasses import dataclass, field

@dataclass(order=True)
class Country:
    name: str
    population: int
    area: float = field(repr=False, compare=False)
    coastline: float = 0

    def beach_per_person(self):
        """Meters of coastline per person"""
        return (self.coastline * 1000) / self.population
```

이 9줄의 코드는 많은 보일러 플레이트 코드와 모범 사례를 보여주고 있습니다. 이 `Country` 클래스를 일반 클래스로 구현하려면 어떤것들이 필요할지 생각해봅시다. `__init__()` 메서드, `repr`, 6개의 비교 메서드 및 `.beach_per_person()` 메서드가 필요합니다. 데이터 클래스로 구현한 `Country` 클래스를 일반 클래스로 구현하면 다음과 같습니다.

```python
class Country:

    def __init__(self, name, population, area, coastline=0):
        self.name = name
        self.population = population
        self.area = area
        self.coastline = coastline

    def __repr__(self):
        return (
            f"Country(name={self.name!r}, population={self.population!r},"
            f" coastline={self.coastline!r})"
        )

    def __eq__(self, other):
        if other.__class__ is self.__class__:
            return (
                (self.name, self.population, self.coastline)
                == (other.name, other.population, other.coastline)
            )
        return NotImplemented

    def __ne__(self, other):
        if other.__class__ is self.__class__:
            return (
                (self.name, self.population, self.coastline)
                != (other.name, other.population, other.coastline)
            )
        return NotImplemented

    def __lt__(self, other):
        if other.__class__ is self.__class__:
            return ((self.name, self.population, self.coastline) < (
                other.name, other.population, other.coastline
            ))
        return NotImplemented

    def __le__(self, other):
        if other.__class__ is self.__class__:
            return ((self.name, self.population, self.coastline) <= (
                other.name, other.population, other.coastline
            ))
        return NotImplemented

    def __gt__(self, other):
        if other.__class__ is self.__class__:
            return ((self.name, self.population, self.coastline) > (
                other.name, other.population, other.coastline
            ))
        return NotImplemented

    def __ge__(self, other):
        if other.__class__ is self.__class__:
            return ((self.name, self.population, self.coastline) >= (
                other.name, other.population, other.coastline
            ))
        return NotImplemented

    def beach_per_person(self):
        """Meters of coastline per person"""
        return (self.coastline * 1000) / self.population
```

클래스가 생성되면 데이터 클래스는 일반 클래스가 됩니다. 따라서 데이터 클래스도 일반 클래스처럼 상속할 수 있습니다. 데이터 클래스의 주목적은 강력한 클래스, 특히 주로 데이터를 저장하는 작은 클래스를 쉽고 빠르게 작성하는 것입니다.

`Country` 데이터 클래스는 다른 클래스와 같은 방식으로 사용할 수 있습니다.

```python
>>> norway = Country("Norway", 5320045, 323802, 58133)
>>> norway
Country(name='Norway', population=5320045, coastline=58133)

>>> norway.area
323802

>>> usa = Country("United States", 326625791, 9833517, 19924)
>>> nepal = Country("Nepal", 29384297, 147181)
>>> nepal
Country(name='Nepal', population=29384297, coastline=0)

>>> usa.beach_per_person()
0.06099946957342386

>>> norway.beach_per_person()
10.927163210085629
```

모든 필드 `.name`, `.population`, `.area` 및 `.coastline`은 클래스를 초기화 할 때 사용됩니다. (물론 `.coastline`은 옵션입니다) `Country` 클래스는 자동으로 생성된 적절한 [repr](https://dbader.org/blog/python-repr-vs-str)을 가지고 있지만 다른 메서드 정의들은 일반 클래스에서와 동일하게 동작합니다.

기본적으로 데이터 클래스는 대등 비교가 가능합니다. `@dataclass` 데코레이터에 `order=True`를 지정했기 때문에 `Country` 클래스는 정렬 또한 가능합니다.

```python
>>> norway == norway
True

>>> nepal == usa
False

>>> sorted((norway, usa, nepal))
[Country(name='Nepal', population=29384297, coastline=0),
 Country(name='Norway', population=5320045, coastline=58133),
 Country(name='United States', population=326625791, coastline=19924)]
```

정렬은 필드값을 기준으로 이루어지며 `.name`, `.population` 등의 순서로 비교가 수행됩니다. 그러나, `field()`를 사용하면 비교할 필드를 [직접 정의](https://realpython.com/python-data-classes/#advanced-default-values) 할 수 있습니다. 이 예제에서 `.area` 필드는 `repr`과 비교에서 제외되었습니다.

데이터 클래스는 [namedtuple](https://dbader.org/blog/writing-clean-python-with-namedtuples)과 일부 동일한 작업을 수행합니다. 하지만 데이터 클래스는 [attrs 프로젝트](http://www.attrs.org/)에서 가장 많은 영향을 받았습니다. 더 많은 예제와 자세한 내용은 [데이터 클래스에 대한 완벽 가이드](https://realpython.com/python-data-classes/)와 공식 문서인 [PEP 557](https://www.python.org/dev/peps/pep-0557/)를 참고하세요.


## 모듈 속성 커스터마이징



## 향상된 타이핑



## 시간 정밀도



## 기타 멋진 기능들



### 딕셔너리 순서 보장



### "async" 및 "await" 키워드 추가



### 새로워진 "asyncio"



### 컨텍스트 변수



### "Importlib.resources"로 데이터 파일 불러오기



### 개발자를 위한 트릭



### 최적화



## 그래서, 업그레이드를 해야하나요?