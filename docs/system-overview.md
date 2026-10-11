## Related documentation

- [PRD](../context/PRD.md) — product goals, scope, and success metrics
- [Architecture](../context/Architecture.md) — technical architecture and component interactions
- [Decisions](../context/Decisions.md) — strategic and implementation decisions behind the design
- [UI Requirements](../context/UI_Requirements.md) — product review workflows and user experience expectations
- [Milestones](../context/Milestones.md) — roadmap, phases, and release acceptance criteria

## 1. Deitiled High-Level Architecture Diagram and Explination

flowchart TD
    TITLE["Product Image Attribute Extraction System"]
    DESC["Automatically identifies product categories and attributes,<br/>generates structured metadata, and improves through human feedback"]

    TITLE ~~~ DESC
    DESC ~~~ A

    A["1. Upload Product Image(s)"]

    A --> B["2. Pretrained Visual Encoder (CLIP)<br/><br/>Extract visual features and suggest categories, colors and patterns"]
    B --> C["Extract Visual Features"]
    C --> D["Predict Category, Color, Pattern, etc."]

    A --> E["3. OCR + Attribute Processing<br/><br/>Read visible labels and brand names;<br/>normalize predictions"]
    E --> F["Extract Visible Brand Names and Text"]

    D --> G["4. Generate Structured Metadata<br/><br/>Return category, color, brand and other<br/>supported attributes as JSON"]
    F --> G

    G --> G1["Output: Structured JSON"]

    G1 --> H["5. Human Review and Correction"]
    H --> I["6. Save Verified Examples"]
    I --> J["Future Training and Model Improvement"]

    J -. "Periodic retraining" .-> B

    classDef heading fill:#1E3A8A,stroke:#1E3A8A,color:#FFFFFF,font-weight:bold
    classDef description fill:#EFF6FF,stroke:#93C5FD,color:#1E3A8A
    classDef input fill:#DBEAFE,stroke:#2563EB,color:#1E3A8A
    classDef ai fill:#D1FAE5,stroke:#059669,color:#064E3B
    classDef review fill:#FEF3C7,stroke:#D97706,color:#78350F
    classDef output fill:#F3E8FF,stroke:#9333EA,color:#581C87

    class TITLE heading
    class DESC description
    class A input
    class B,C,D,E,F,G ai
    class G1 output
    class H,I,J review

### Explination

Our Product Image Attribute Extraction System is an AI system that takes product images, identifies the product and its characteristics, and automatically creates structured information that can be used for product listings in an e-commerce website.

Let's understand each component in the Mermaid diagram, step by step.

#### 1. System Title and Description

Product Image Attribute Extraction System

This is the name of our system.

The description explains its main purpose: automatically identify product categories, extract product attributes, generate structured metadata, and improve predictions through human feedback.

Example: A seller uploads a photo of a blue T-shirt. Instead of entering every detail manually, the system suggests its category, color, and pattern.

#### 2. Upload Product Image(s)

What does it do?

This is the starting point of our system. The seller uploads one or more images of a product through the application.

Input: Product photographs.

Example: A seller uploads the front and back images of a T-shirt.

The uploaded images are passed to the AI processing components.

#### 3. Pretrained Visual Encoder (CLIP)

What is CLIP?

CLIP is a pretrained AI model that learns relationships between images and text. We can use it to compare a product image against descriptions of possible categories or attributes without training it on our own examples first.

What does it do in our system?

It analyzes the visual content of the product image and helps predict characteristics such as:

- Product category — T-shirt, shoes, bag, etc.
- Color — blue, black, white, etc.
- Pattern — striped, checked, solid, etc.

Example: When it receives an image of a blue T-shirt, CLIP might find that the image matches “blue T-shirt” more strongly than “black trousers.”

Why use a pretrained model?

We can start without collecting our own training dataset or fine-tuning a visual model. However, we must still test its predictions against labeled data to measure accuracy.

#### 4. Extract Visual Features

This component represents the visual information extracted from the image.

Imagine that the model converts the image into a numerical representation that captures useful visual patterns. This representation is called a feature embedding.

For example, it may encode information related to shape, texture, color, and visual appearance.

You don't need to manually program rules such as “if the image has sleeves, it must be a T-shirt.” The pretrained model has learned many visual patterns already.

In simple terms: It converts the image into information the AI model can work with.

#### 5. Predict Category, Color, Pattern, etc.

Using the visual representation and candidate descriptions, the system produces likely product categories and attributes.

For example:

| Attribute   | Predicted value |
| ----------- | --------------- |
| Category    | T-shirt         |
| Color       | Blue            |
| Pattern     | Solid           |
| Sleeve type | Short sleeve    |

These are predictions, not guaranteed facts. In particular, material composition and exact brand identity can be difficult to determine from appearance alone.

#### 6. OCR and Attribute Processing

OCR stands for Optical Character Recognition.

OCR reads text that appears inside an image.

Why do we need it?

Product images may contain brand logos, printed names, model numbers, or labels with useful information.

OCR can read visible text and help recover information that the visual encoder may not identify reliably.

For example, if a shoe label contains a readable brand name, OCR can attempt to extract that name.

The attribute-processing part then cleans and standardizes the extracted results. For instance, it might convert “blu” or “Blue” into a consistent value such as `"Blue"`.

Important: OCR cannot reliably identify text that is not visible, too small, or blurred. A logo may also require a separate logo-recognition approach if its text cannot be read.

#### 7. Generate Structured Metadata

Now the system combines information from the visual model and OCR into a consistent format.

Instead of returning a paragraph such as “This appears to be a blue T-shirt,” it returns structured data that software can process.

For example:

```
{
  "category": "T-shirt",
  "color": "Blue",
  "pattern": "Solid",
  "brand": null,
  "material": null
}
```

Here, `null` indicates that the system could not determine that attribute confidently from the available evidence.

This output is called structured metadata. It can be stored in a database or used to pre-fill an e-commerce product listing form.

#### 8. Output: Structured JSON

JSON is the format in which we deliver the extracted information to the next component or application.

Think of it as a standard container for product details.

For example, a frontend application can read `"category": "T-shirt"` and automatically fill the category field in a listing form.

The distinction is that metadata generation organizes the information, while JSON is the format used to represent it.

#### 9. Human Review and Correction

AI predictions can be incorrect, so we allow the seller or reviewer to inspect the generated metadata.

For example:

| Field    | AI prediction | User correction              |
| -------- | ------------- | ---------------------------- |
| Category | T-shirt       | T-shirt                      |
| Color    | Black         | Blue                         |
| Pattern  | Solid         | Striped                      |
| Brand    | Unknown       | Brand name entered by seller |

The user confirms correct values and corrects incorrect ones.

Why is this component important?

It improves catalog quality and provides trusted labels for future model development. It also prevents uncertain AI predictions from automatically becoming verified product facts.

#### 10. Save Verified Examples

After review, the system saves the image reference and the corrected attributes in a database.

A stored record might contain:

- Image ID or image location
- Verified category
- Verified color and pattern
- Verified brand, when available
- Source of the information and review status

Over time, these records form a labeled dataset specific to our application.

This is how the system can collect useful training examples as people use it.

#### 11. Future Training and Model Improvement

Once we have collected enough verified examples, we can evaluate whether the model needs improvement.

Possible actions include:

- Training a small classifier using features extracted by CLIP.
- Improving category prompts or attribute-processing rules.
- Fine-tuning a model using verified images and labels.
- Evaluating the updated model on a separate test dataset.

The dotted arrow in the diagram represents this feedback loop.

It does not mean that the model automatically learns every time a user corrects a field. We would normally collect corrections, prepare a suitable training dataset, retrain or update the model periodically, and test the new version before deployment.

#### How everything works together

Input

The seller uploads product images.

AI processing

CLIP analyzes visual characteristics, while OCR reads visible text. Their results are combined and normalized.

Output

The system generates structured product metadata in JSON format.

Review and learning

The user verifies the results, and corrected examples are saved for future improvement.

#### One important design decision

Your stated targets are at least 95% category classification accuracy and 90% attribute F1 score. The architecture gives us a path toward those targets, but the model choices alone do not guarantee them. We must evaluate both metrics on a representative, manually labeled test set.